import { NotificationT } from '../util/interfaces'

export class NotificationElement extends HTMLElement {
  level: NotificationT['level']
  message: string
  notificationTemplateEl: HTMLTemplateElement
  mainPageNotificationWrapper: HTMLElement
  constructor({ level, message }: NotificationT) {
    super()
    this.message = message
    this.level = level
    this.notificationTemplateEl = document.getElementById(
      'notification-template'
    ) as HTMLTemplateElement
    this.mainPageNotificationWrapper = document.getElementById(
      'notifications-wrapper'
    )
    this.mainPageNotificationWrapper.appendChild(this)
    this.render()
  }

  render() {
    const notificationNode = this.notificationTemplateEl.content.cloneNode(true)
    this.appendChild(notificationNode)
    const notificationEl = this.lastElementChild
    notificationEl.classList.add(this.level)
    notificationEl.innerHTML = this.message
  }
}

customElements.define('notification-quote', NotificationElement)
