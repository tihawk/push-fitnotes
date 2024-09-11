import Swal from 'sweetalert2'
import M from 'materialize-css'

export const Progress = Swal.mixin({
  allowEscapeKey: () => !Swal.isLoading(),
  allowOutsideClick: () => !Swal.isLoading(),
  allowEnterKey: () => !Swal.isLoading(),
  title: 'Working on it!',
  icon: 'info',
  didOpen: () => Swal.showLoading(),
})

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-right',
  showConfirmButton: false,
  timer: 3000,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

export function updateValue(e: Event, object, key, ref?) {
  // @ts-ignore
  object[key] = e.target.value
  ref && ref.render()

  initCollapsible()
}

export function updateCheckbox(e: Event, object, key, ref?) {
  // @ts-ignore
  object[key] = e.target.checked
  ref && ref.render()

  initCollapsible()
}

export function initCollapsible() {
  const elems = document.querySelectorAll('.collapsible')
  const instances = M.Collapsible.init(elems, { accordion: false })
}
