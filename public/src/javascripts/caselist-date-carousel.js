import Splide from '@splidejs/splide'

document.addEventListener('DOMContentLoaded', () => {

  if (document.querySelector('section.splide')) {

    const options = {
      drag: 'free',
      snap: true,
      pagination: false,
      fixedWidth: '100px',
      breakpoints: {
        640: {
          perPage: 6,
          perMove: 3,
        },
      },
      focus: 'center',
    }

    const splide = new Splide('.splide', options)
    splide.mount()

    const { Arrows: { arrows }, Slides } = splide.Components

    Slides.forEach((slideComponent) => {
      slideComponent.slide.setAttribute('role', 'link')
    })

    arrows.next.addEventListener('click', () => {
      splide.go('>')
    })

    arrows.prev.addEventListener('click', () => {
      splide.go('<')
    })
  }
})