const dropdowns = document.getElementsByClassName('dropdown')
const modals = [...document.getElementsByClassName('modal')]
const modalOpens = [...document.getElementsByClassName('modal-open')]
const modalCloses = [...document.getElementsByClassName('modal-close')]
const carousels = [...document.getElementsByClassName('carousel')]
const switchers = [...document.getElementsByClassName('switcher')]
const progresses = document.getElementsByClassName('progress')
const textareas = document.getElementsByClassName('textarea-autoheight')
const selects = document.getElementsByTagName('select')
const uploadTriggers = document.getElementsByClassName('upload-trigger')

// Togglable
class Togglable {
  set() {
    this.el.classList.add('active')
  }

  unset() {
    this.el.classList.remove('active')
  }

  toggle() {
    this.el.classList.toggle('active')
  }
}

for (let item of dropdowns) {
  const trigger = item.getElementsByClassName('dropdown-trigger')[0]

  item.addEventListener('focusout', (e) => {
    e.preventDefault()
    item.classList.remove('active')
  })

  trigger.addEventListener('click', (e) => {
    e.preventDefault()
    item.classList.toggle('active')
    trigger.focus()
  })
}

// Modal
class Modal extends Togglable {
  constructor(el) {
    super()
    this.el = el
  }
}

class ModalTrigger {
  constructor(el) {
    this.el = el
  }

  set target(value) {
    this.el.dataset.target = value
  }

  get target() {
    return new Modal(document.getElementById(this.el.dataset.target))
  }
}

// for (let modal of modals.map(el => new Modal(el))) {
//   console.log(modal)
// }

for (let trigger of modalOpens.map(el => new ModalTrigger(el))) {
  trigger.el.addEventListener('click', () => trigger.target.set())
}

for (let trigger of modalCloses.map(el => new ModalTrigger(el))) {
  trigger.el.addEventListener('click', () => trigger.target.unset())
}

// DEPRECATED
for (let modal of modals) {
  const trigger = modal.dataset.trigger
  
  if(trigger) {
    document.getElementById(trigger).addEventListener('click', e => {
      e.preventDefault()
      modal.classList.add('active')
    })
  }
  
  modal.addEventListener('click', e => {
    if (modal === e.target) {
      e.preventDefault()
      modal.classList.remove('active')
    }
  })
}

// Carousel
class CarouselItem extends Togglable {
  constructor(el) {
    super()
    this.el = el
  }

  get name() {
    return this.el.dataset.name
  }

  set name(x) {
    this.el.dataset.name = x
  }
}

class CarouselIndicator extends Togglable {
  constructor(el) {
    super()
    this.el = el
  }

  get target() {
    return this.el.dataset.target
  }

  set target(x) {
    this.el.dataset.target = x
  }
}

class Carousel {
  constructor(el) {
    this.el           = el
    this.contentEl    = el.getElementsByClassName('carousel-content')[0]
    this.indicatorsEl = el.getElementsByClassName('carousel-indicators')[0]
    this.items        = [...el.getElementsByClassName('carousel-item')].filter(o => o.parentElement == this.contentEl).map(o => new CarouselItem(o))
    this.buttonNext   = el.getElementsByClassName('carousel-next')[0]
    this.buttonBack   = el.getElementsByClassName('carousel-back')[0]
    this.indicators   = [...this.indicatorsEl.children].map(o => new CarouselIndicator(o))
    
    this.buttonNext.addEventListener('click', (e) => {
      e.preventDefault()
      this.next()
    })

    this.buttonBack.addEventListener('click', (e) => {
      e.preventDefault()
      this.back()
    })

    for(const indicator of this.indicators) {
      indicator.el.addEventListener('click', (e) => {
        e.preventDefault()
        this.value = indicator.target
      })
    }
  }

  back() {
    this.value = this.items.slice(this.getItemIndex(this.value) - 1)[0].name
  }

  next() {
    this.value = this.items.slice((this.getItemIndex(this.value) + 1) % this.length)[0].name
  }

  get length() {
    return this.items.length
  }

  get value() {
    return this.el.dataset.value
  }

  set value(x) {
    const old = this.value
    
    this.el.dataset.value = x
    this.contentEl.style.left = `${-100 * this.getItemIndex(x)}%`
    
    if(old) {
      this.getItem(old).unset()
    }
    this.getItem(x).set()
  }

  getItemIndex(key) {
    return this.items.findIndex(o => o.name === key)
  }

  getItem(key) {
    return this.items.find(o => o.name === key)
  }
}

for (let carousel of carousels.map(el => new Carousel(el))) {
  carousel.value = carousel.value
}

// Switcher
class SwitcherHeaderItem extends Togglable {
  constructor(el) {
    super()
    this.el = el
  }

  get target() {
    return this.el.dataset.target
  }

  set target(x) {
    this.el.dataset.target = x
  }
}

class SwitcherItem extends CarouselItem {
  constructor(el) {
    super(el)
  }
}

class Switcher {
  constructor(el) {
    this.el           = el
    this.headerEl     = el.getElementsByClassName('switcher-header')[0]
    this.contentEl    = el.getElementsByClassName('switcher-content')[0]
    this.headerItems  = [...el.getElementsByClassName('switcher-header-item')].filter(o => o.parentElement == this.headerEl).map(o => new SwitcherHeaderItem(o))
    this.items        = [...el.getElementsByClassName('switcher-item')].filter(o => o.parentElement == this.contentEl).map(o => new SwitcherItem(o))
  }

  get value() {
    return this.el.dataset.value
  }

  set value(x) {
    const old = this.value
    
    this.el.dataset.value = x
    this.contentEl.style.left = `${-100 * this.getItemIndex(x)}%`
    
    if(old) {
      this.getHeaderItem(old).unset()
      this.getItem(old).unset()
    }
    this.getHeaderItem(x).set()
    this.getItem(x).set()
  }

  getHeaderItemIndex(key) {
    return this.headerItems.findIndex(o => o.target === key)
  }

  getHeaderItem(key) {
    return this.headerItems.find(o => o.target === key)
  }

  getItemIndex(key) {
    return this.items.findIndex(o => o.name === key)
  }

  getItem(key) {
    return this.items.find(o => o.name === key)
  }
}

for (let switcher of switchers.map(el => new Switcher(el))) {
  for(let headerItem of switcher.headerItems) {
    headerItem.el.addEventListener('click', (e) => {
      switcher.value = headerItem.target
    })
  }

  switcher.value = switcher.value
}

// Progress
for (let el of progresses) {
  const content = el.getElementsByClassName('progress-value')[0]
  const value = content.dataset.value || 0
  const maxValue = content.dataset.maxValue || 100

  content.style.width = `${100 * value / maxValue}%`
}

for (let el of textareas) {
  el.addEventListener('input', () => {
    el.style.height = '2.5em'
    el.style.height = `${el.scrollHeight}px`
  })
}

for (let el of selects) {
  const value = el.getAttribute('value')
  const options = el.getElementsByTagName('option')
  const optionsByValue = Object.fromEntries([...options].map(e => [e.getAttribute('value'), e]))
  const defaultOption = optionsByValue[value]

  if(defaultOption) {
    defaultOption.selected = true
  }
}

for(let el of uploadTriggers) {
  const target = el.form[el.dataset.target]

  el.addEventListener('click', (ev) => {
    ev.preventDefault()
    target.click()
  })
  target.addEventListener('change', (ev) => el.form.submit())
}