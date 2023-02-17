import { FitConstants, FitEncoder, FitMessages, Message } from 'fit-encoder'
import { ActivityT, SettingsT } from '../util/interfaces'
import settings from 'electron-json-storage'
import { SETTINGS_EXPORT_DATA } from '../util/constants'

export default class ActivityEncoder extends FitEncoder {
  activitiy: ActivityT
  constructor(activitiy: ActivityT) {
    super()
    this.activitiy = activitiy
    const exportSettings: SettingsT['exportData'] = settings.getSync(
      SETTINGS_EXPORT_DATA
    ) as SettingsT['exportData']
    const avgHeartRate = exportSettings.defaultAvgHeartrate
    const defaultRestTime = Math.floor(exportSettings.defaultRestTime * 60) // make into seconds
    const defaultActiveTime = Math.floor(exportSettings.defaultActiveTime)
    const shouldGenerateHeartrate = exportSettings.shouldGenerateHeartrate

    // define messages we'll use
    const fileIdMessage = new Message(
      FitConstants.mesg_num.file_id,
      FitMessages.file_id,
      'time_created',
      'manufacturer',
      'product',
      'type'
    )
    const eventMessage = new Message(
      FitConstants.mesg_num.event,
      FitMessages.event,
      'timestamp',
      'data',
      'event',
      'event_type'
    )
    const deviceInfoMessage = new Message(
      FitConstants.mesg_num.device_info,
      FitMessages.device_info,
      'timestamp',
      'product_name',
      'manufacturer',
      'product',
      'device_index'
    )
    const sportMessage = new Message(
      FitConstants.mesg_num.sport,
      FitMessages.sport,
      'sport',
      'sub_sport'
    )
    const workoutMessage = new Message(
      FitConstants.mesg_num.workout,
      FitMessages.workout,
      'wkt_name',
      'sport',
      'sub_sport'
    )
    const activeSetMessage = new Message(
      FitConstants.mesg_num.set,
      FitMessages.set,
      'timestamp',
      'duration',
      'start_time',
      'repetitions',
      'weight',
      'category',
      'category_subtype',
      'weight_display_unit',
      'message_index',
      'set_type'
    )
    const restSetMessage = new Message(
      FitConstants.mesg_num.set,
      FitMessages.set,
      'timestamp',
      'duration',
      'start_time',
      'message_index',
      'set_type'
    )
    const recordMessage = new Message(
      FitConstants.mesg_num.record,
      FitMessages.record,
      'timestamp',
      'heart_rate'
    )
    const sessionMessage = new Message(
      FitConstants.mesg_num.session,
      FitMessages.session,
      'timestamp',
      'start_time',
      'total_elapsed_time',
      'total_timer_time',
      'total_distance',
      'total_cycles',
      'first_lap_index',
      'num_laps',
      // "total_work",
      // "total_moving_time",
      //"avg_speed",
      //"max_speed",
      // "avg_power",
      //"max_power",
      // "normalized_power",
      // "training_stress_score",
      // "intensity_factor",
      //"threshold_power",
      'event',
      'event_type',
      'sport',
      'sub_sport',
      'avg_heart_rate'
      // "max_heart_rate",
      // "avg_cadence",
      // "max_cadence",
      //"min_heart_rate"
    )
    const activityMessage = new Message(
      FitConstants.mesg_num.activity,
      FitMessages.activity,
      'total_timer_time',
      'local_timestamp',
      'num_sessions',
      'type',
      'event',
      'event_type'
    )

    // start the encoding

    const startTime = FitEncoder.toFitTimestamp(activitiy.startTime)
    // accumulators
    let totalElapsedTime = 0
    let setStartTime = startTime
    let timestamp = startTime
    let setIndex = 0
    let totalRepsCycles = 0

    // file id message with manufacturer info
    fileIdMessage.writeDataMessage(
      startTime,
      FitConstants.manufacturer.the_hurt_box,
      0,
      FitConstants.file.activity
    )

    // start event
    eventMessage.writeDataMessage(
      startTime,
      0,
      FitConstants.event.timer,
      FitConstants.event_type.start
    )

    // device info message
    deviceInfoMessage.writeDataMessage(
      startTime,
      'SYSTM',
      FitConstants.manufacturer.the_hurt_box,
      0,
      FitConstants.device_index.creator
    )

    // sport message
    sportMessage.writeDataMessage(
      FitConstants.sport.training,
      FitConstants.sub_sport.strength_training
    )

    // workout message
    workoutMessage.writeDataMessage(
      'Strength Workout @ Home',
      FitConstants.sport.training,
      FitConstants.sub_sport.strength_training
    )

    // generate a single record, since some online platforms require at least one
    recordMessage.writeDataMessage(timestamp, avgHeartRate)

    // ok. let's start actually doing something useful
    // writing set and record messages
    for (const set of activitiy.sets) {
      console.log(set)
      const restTime = set.restTime || defaultRestTime || 0
      const duration = set.duration || defaultActiveTime || 0
      // active set message
      activeSetMessage.writeDataMessage(
        timestamp,
        duration * 1000,
        setStartTime,
        set.reps,
        set.weight * 16.0, // scale is 16 if you can believe it
        set.category,
        set.subCategory,
        FitConstants.fit_base_unit.kilogram,
        setIndex,
        FitConstants.set_type.active
      )
      // increment accumulators before writing rest set message
      setIndex += 1
      setStartTime += duration
      totalRepsCycles += set.reps * 1

      recordMessage.writeDataMessage(timestamp, avgHeartRate)

      restSetMessage.writeDataMessage(
        timestamp,
        restTime * 1000,
        setStartTime,
        setIndex,
        FitConstants.set_type.rest
      )

      // increment again
      setIndex += 1
      setStartTime += restTime
      totalElapsedTime += duration + restTime

      recordMessage.writeDataMessage(timestamp, avgHeartRate)
    }

    console.log('totalElapsedTime:', totalElapsedTime)
    timestamp = startTime + totalElapsedTime
    // End event, add lap, session and activity messages as required
    // Timer Events are a BEST PRACTICE for FIT ACTIVITY files
    eventMessage.writeDataMessage(
      timestamp,
      0,
      FitConstants.event.timer,
      FitConstants.event_type.stop_all
    )

    eventMessage.writeDataMessage(
      timestamp,
      0,
      FitConstants.event.session,
      FitConstants.event_type.stop_disable_all
    )
    // Every FIT ACTIVITY file MUST contain at least one Lap message TODO?

    // Every FIT ACTIVITY file MUST contain at least one Session message
    sessionMessage.writeDataMessage(
      timestamp,
      startTime,
      totalElapsedTime * 1000,
      totalElapsedTime * 1000,
      0,
      totalRepsCycles,
      0,
      activitiy.sets.length,
      FitConstants.event.lap,
      FitConstants.event_type.stop,
      FitConstants.sport.training,
      FitConstants.sub_sport.strength_training,
      avgHeartRate
    )

    // Every FIT ACTIVITY file MUST contain EXACTLY one Activity message
    activityMessage.writeDataMessage(
      totalElapsedTime,
      startTime,
      1,
      FitConstants.activity.manual,
      FitConstants.event.activity,
      FitConstants.event_type.stop
    )
  }
}
