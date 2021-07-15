<template lang="pug">
b-container.mt-5
  b-button.p-3.table-of-content(v-b-toggle.sidebar-right) 
    .fas.fa-list
    | table of content
  p.mt-3
    | this page presents all components available in Declick; this page is only
    | available in 
    code development 
    | mode

  b-sidebar#sidebar-right(title='Sidebar', right='', shadow='')
    .p-2.text-dark
      a.d-block(href='#font') Font
      a.d-block(href='#theme-colors') theme colors
      a.d-block(href='#all-colors') All colors
    .p-2(v-for='type in types')
      a.d-block(:href="'#'+type") 
        | {{ type }}
        a.float-right.fas.fa-book(
          :href="'https://bootstrap-vue.org/docs/components/' + type"
          target="_blank"
        )

  b-row
    h1.col-12.text-center design
    h2#font.col-12 font
    p main font is
      code Raleway
      |  
      | for children to ease reading lower l and upper I
    h2#theme-colors.col-12 theme colors
    b-col
      .p-3.mb-3.bg-primary primary
    b-col
      .p-3.mb-3.bg-secondary secondary
    b-col
      .p-3.mb-3.bg-success success
    b-col
      .p-3.mb-3.bg-info info
    b-col
      .p-3.mb-3.bg-warning warning
    b-col
      .p-3.mb-3.bg-danger danger
    b-col
      .p-3.mb-3.bg-light.text-dark light
    b-col
      .p-3.mb-3.bg-dark dark

  b-row
    h2#all-colors.col-12 all colors
    b-col
      .p-3.mb-3(style='background-color: var(--blue)') blue
    b-col
      .p-3.mb-3(style='background-color: var(--indigo)') indigo
    b-col
      .p-3.mb-3(style='background-color: var(--purple)') purple
    b-col
      .p-3.mb-3(style='background-color: var(--pink)') pink
    b-col
      .p-3.mb-3(style='background-color: var(--red)') red
    b-col
      .p-3.mb-3(style='background-color: var(--orange)') orange
    b-col
      .p-3.mb-3(style='background-color: var(--yellow)') yellow
    b-col
      .p-3.mb-3(style='background-color: var(--green)') green
    b-col
      .p-3.mb-3(style='background-color: var(--teal)') teal
    b-col
      .p-3.mb-3(style='background-color: var(--cyan)') cyan

    h2.col-12 components

  h3#alert.col-12.ml-3.mt-4 Alert
  b-alert(show, dismissible) Default Alert
  b-alert(variant='success', show, dismissible) Success Alert
  b-alert(variant='warning', show, dismissible) Warning Alert
  b-alert(variant='danger', show, dismissible) Danger Alert
  b-alert(variant='secondary', show, dismissible) Secondary Alert
  b-alert(variant='primary', show, dismissible) Primary Alert

  h3#aspect.col-12.ml-3.mt-4 Aspect
  p available aspect ratio :
    | <code>4:3</code>, <code>1:1</code>, <code>16:9</code>, <code>1.85:1</code>, <code>2:1</code>,
    | <code>21:9</code>, <code>1.43:1</code>, <code>3:2</code>, <code>3:1</code>, <code>4/3</code>,
    | <code>16/9</code>, <code>3</code>, <code>2</code>, <code>1.85</code>, <code>1.5</code>, <code>1</code>
  b-aspect.bg-secondary(aspect='21:9')
    | ratio 21:9

  h3#avatar.col-12.ml-3.mt-4 Avatar
  b-avatar.mr-2
  b-avatar.mr-2(variant='primary', text='BV')
  b-avatar.mr-2(
    variant='info',
    src='https://www.colombbus.org/colombbus/themes/colombbus/img/logo-declick.png'
  )
  b-avatar.mr-2(variant='success', icon='people-fill')
  b-avatar.mr-2(
    src='https://www.colombbus.org/colombbus/themes/colombbus/img/logo-declick.png',
    size='6rem'
  )

  h3#badge.col-12.ml-3.mt-4 Badge
  p Lorem ipsum
    b-badge badge
    |
    | dolor sit amet, consectetur
    b-badge(variant='danger') danger
    |
    | adipisicing elit
    b-badge(pill, variant='primary') pill
    |
    | adipisicing elit.

  h3#breadcrumb.col-12.ml-3.mt-4 Breadcrumb
  b-breadcrumb(
    :items='[ { text: "Admin", href: "#" }, { text: "Category", href: "#" }, { text: "Manage", active: true }, ]'
  )

  h3#button.col-12.ml-3.mt-4 Button
  b-button.mr-2 Button
  b-button.mr-2(variant='primary') Button
  b-button.mr-2(variant='warning') Button
  b-button.mr-2(variant='danger') Button
  b-button.mr-2(disabled, squared, variant='success') Button
  b-button.mr-2(variant='info') Button
  b-button.mr-2(pills, variant='light') Button
  b-button.mr-2(pill, variant='outline-primary') Button
  b-button.mr-2(squared, variant='outline-warning') Button
  b-button.mr-2(variant='outline-danger') Button
  b-button.mr-2(variant='outline-success') Button
  b-button.mr-2(variant='outline-info') Button
  b-button.mr-2(variant='outline-light', size='lg') Button

  h3#button-group.col-12.ml-3.mt-4 Group Button
  b-button-group.mr-3
    b-button(variant='success') Success
    b-button(variant='info') Info
    b-button(variant='warning') Warning
  b-button-group.mr-3(size='sm')
    b-button(variant='success') Success
    b-button(variant='info') Info
    b-button(variant='warning') Warning
  b-button-group.mr-3(vertical)
    b-button(variant='success') Success
    b-button(variant='info') Info
    b-button(variant='warning') Warning
  b-button-group
    b-button Button
    b-dropdown(right='', text='Menu')
      b-dropdown-item Item 1
      b-dropdown-item Item 2
      b-dropdown-divider
      b-dropdown-item Item 3
    b-dropdown(right='', split='', text='Split Menu')
      b-dropdown-item Item 1
      b-dropdown-item Item 2
      b-dropdown-divider
      b-dropdown-item Item 3

  h3#button-toolbar.col-12.ml-3.mt-4 Toolbar Button
  b-button-toolbar.pb-4(key-nav='', aria-label='Toolbar with button groups')
    b-button-group.mx-1
      b-button «
      b-button ‹
    b-button-group.mx-1
      b-button Edit
      b-button Undo
      b-button Redo
    b-button-group.mx-1
      b-button ›
      b-button »

  b-button-toolbar.pb-4(
    aria-label='Toolbar with button groups and input groups'
  )
    b-button-group.mr-1(size='sm')
      b-button Save
      b-button Cancel
    b-input-group(size='sm', prepend='€', append=',00')
      b-form-input.text-right(type='number', :value='100')

  h3#calendar.col-12.ml-3.mt-4 Calendar
  b-calendar(
    v-model='datepickerValue',
    @context='onDatePickerContext',
    locale='fr-FR'
  )
  p 
    | Value:
    code 
      | {{ datepickerValue }}
  pre.mb-0 Context {{ datepickerContext }}

  h3#card.col-12.ml-3.mt-4 Card
  b-card.mb-2(
    title='Card Title',
    img-src='https://picsum.photos/600/300/?image=25',
    img-alt='Image',
    img-top='',
    tag='article',
    style='max-width: 20rem'
  )
    b-card-text
      | Some quick example text to build on the card title and make up the bulk of the card's content.
    b-button(href='#', variant='primary') Go somewhere

  h3#Carousel.col-12.ml-3.mt-4 Carousel
  b-carousel#carousel-1(
    slide='false',
    :interval='2000',
    controls='',
    indicators='',
    background='#ababab',
    img-width='1024',
    img-height='480',
    style='text-shadow: 1px 1px 2px #333'
  )
    //- Text slides with image
    b-carousel-slide(
      caption='First slide',
      text='Nulla vitae elit libero, a pharetra augue mollis interdum.',
      img-src='https://picsum.photos/1024/480/?image=52'
    )
    //- Slides with custom text
    b-carousel-slide(img-src='https://picsum.photos/1024/480/?image=54')
      h1 Hello world!
    //- Slides with image only
    b-carousel-slide(img-src='https://picsum.photos/1024/480/?image=58')
    //- Slides with img slot
    //- Note the classes .d-block and .img-fluid to prevent browser default image alignment
    b-carousel-slide
      template(#img='')
        img.d-block.img-fluid.w-100(
          src='https://picsum.photos/1024/480/?image=55',
          alt='image slot',
          width='1024',
          height='480'
        )
    //- Slide with blank fluid image to maintain slide aspect ratio
    b-carousel-slide(
      caption='Blank Image',
      img-blank='',
      img-alt='Blank image'
    )
      p
        | Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros felis, tincidunt
        | a tincidunt eget, convallis vel est. Ut pellentesque ut lacus vel interdum.

  h3#collapse.col-12.ml-3.mt-4 Collapse
  b-button(v-b-toggle.collapse-1='', variant='primary') Toggle Collapse
  b-collapse#collapse-1.mt-2
    b-card
      p.card-text Collapse contents Here
      b-button(v-b-toggle.collapse-1-inner='', size='sm') Toggle Inner Collapse
      b-collapse#collapse-1-inner.mt-2
        b-card Hello!
  h4.col-12.ml-3.mt-4 Accordion
  .accordion(role='tablist')
  b-card.mb-1(no-body='')
    b-card-header.p-1(header-tag='header', role='tab')
      b-button(block='', v-b-toggle.accordion-1='', variant='secondary') Accordion 1
    b-collapse#accordion-1(
      visible='',
      accordion='my-accordion',
      role='tabpanel'
    )
      b-card-body
        b-card-text
          | I start opened because
          code visible
          |
          | is
          code true
        b-card-text text
  b-card.mb-1(no-body='')
    b-card-header.p-1(header-tag='header', role='tab')
      b-button(block='', v-b-toggle.accordion-2='', variant='secondary') Accordion 2
    b-collapse#accordion-2(accordion='my-accordion', role='tabpanel')
      b-card-body
        b-card-text text
  b-card.mb-1(no-body='')
    b-card-header.p-1(header-tag='header', role='tab')
      b-button(block='', v-b-toggle.accordion-3='', variant='secondary') Accordion 3
    b-collapse#accordion-3(accordion='my-accordion', role='tabpanel')
      b-card-body
        b-card-text text

  h3#dropdown.col-12.ml-3.mt-4 Dropdown
  b-dropdown#dropdown-1.m-md-2(text='Dropdown Button')
    b-dropdown-item First Action
    b-dropdown-item Second Action
    b-dropdown-item Third Action
    b-dropdown-divider
    b-dropdown-item(active='') Active action
    b-dropdown-item(disabled='') Disabled action

  h3#embed.col-12.ml-3.mt-4 Embed
  b-embed(
    type='iframe',
    aspect='16by9',
    src='https://player.vimeo.com/video/211507001?title=0&byline=0&portrait=0',
    allowfullscreen
  )

  h3#form.col-12.ml-3.mt-4 Form
  b-form.mb-3
    b-form-group#input-group-1(
      label='Email address:',
      label-for='input-1',
      description='We\'ll never share your email with anyone else.',
      :state='true'
    )
      b-form-input#input-1(
        type='email',
        placeholder='Enter email',
        required=''
      )
    b-form-group#input-group-2(
      label='Your Name:',
      label-for='input-2',
      :state='true'
    )
      b-form-input#input-2(placeholder='Enter name', required='')
    b-form-group#input-group-4(:state='true')
      b-form-checkbox-group#checkboxes-4
        b-form-checkbox(value='me') Check me out
        b-form-checkbox(value='that') Check that out
    b-button(type='submit', variant='primary') Submit
    b-button(type='reset', variant='danger') Reset

  h3#form-checkbox.col-12.ml-3.mt-4 Form Checkbox
  b-form-checkbox#checkbox-1.mb-3(
    name='checkbox-1',
    value='accepted',
    unchecked-value='not_accepted'
  )
  | I accept the terms and use

  h3#form-datepicker.col-12.ml-3.mt-4 Form Datepicker
  label(for='datepicker-buttons') Date picker with optional footer buttons
  b-form-datepicker#datepicker-buttons.mb-3(
    today-button='',
    reset-button='',
    close-button='',
    :dark='true',
    locale='en'
  )

  h3#form-file.col-12.ml-3.mt-4 Form File
  b-form-file.mb-3(
    placeholder='Choose a file or drop it here...',
    drop-placeholder='Drop file here...'
  ) Selected file:

  h3#form-group.col-12.ml-3.mt-4 Form Group
  b-form-group#fieldset-1(
    description='Let us know your name.',
    label='Enter your name',
    label-for='input-1',
    valid-feedback='Thank you!',
    invalid-feedback='invalidFeedback',
    :state='false'
  )
    b-form-input#input-1(:state='false', trim)

  h3#form-input.col-12.ml-3.mt-4 Form Input
  form.my-2
    b-form-group(
      v-for='type in ["text", "number", "email", "password", "search", "url", "tel", "date", "time", "range", "color"]',
      :state='true',
      :key='type'
    )
      label(:for='`type-${type}`') Type <code>{{ type }}</code>
      b-form-input(:id='`type-${type}`', :type='type')

  h3#form-radio.col-12.ml-3.mt-4 Form Radio
  b-form-group(label='Individual radios', :state='true')
  b-form-radio(name='some-radios', value='A') Option A
  b-form-radio(name='some-radios', value='B') Option B

  h3#form-rating.col-12.ml-3.mt-4 Form Rating
  b-form-rating(:value='3')

  h3#form-select.col-12.ml-3.mt-4 Form Select
  b-form-select(:value='1', :options='[1, 2, 3]')

  h3#form-spinbutton.col-12.ml-3.mt-4 Form Spinbutton
  label(for='demo-sb') Spin Button
  b-form-spinbutton#demo-sb(:value='5', min='1', max='100')

  h3#form-tags.col-12.ml-3.mt-4 Form Tags
  b-form-tags(input-id='tags-basic', :value='["JS", "PHP", "DECLICK"]')

  h3#form-textarea.col-12.ml-3.mt-4 Form Textarea
  b-form-textarea#textarea(
    value='lorem declickum',
    placeholder='Enter something...',
    rows='3',
    max-rows='6'
  )

  h3#form-timepicker.col-12.ml-3.mt-4 Form Timepicker
  b-form-timepicker(value='12:00:00', locale='fr')

  h3#Image.col-12.ml-3.mt-4 Image
  b-img(
    src='../../assets/images/archives/explore-robot.png',
    fluid,
    alt='Responsive image'
  )

  h3#input-group.col-12.ml-3.mt-4 Input Group
  b-input-group.mt-3(prepend='Username')
    b-form-input
    b-input-group-append
      b-button(:variant='inputGrouptype ? "outline-success" : "info"') Button

  h3#jumbotron.col-12.ml-3.mt-4 Jumbotron
  b-jumbotron
    template(#header='') declick jumbotron
    template(#lead='')
      | This is a simple hero unit, a simple jumbotron-style component for calling extra attention to
      | featured content or information.
    hr.my-4
    p
      | It uses utility classes for typography and spacing to space content out within the larger
      | container.
    b-button(variant='primary', href='#') Do Something
    b-button(variant='success', href='#') Do Something Else

  h3#layout-and-grid-system.col-12.ml-3.mt-4 Layout and Grid System
  b-row
    b-col.bg-warning 1 sur 3
    b-col.bg-danger 2 sur 3
    b-col.bg-success 3 sur 3
  h3#link.col-12.ml-3.mt-4 Link
  b-link(href='#foo') Link

  h3#list-group.col-12.ml-3.mt-4 List group
  b-list-group
    b-list-group-item(disabled) Cras justo odio
    b-list-group-item Dapibus ac facilisis in
    b-list-group-item Morbi leo risus
    b-list-group-item Porta ac consectetur ac
    b-list-group-item Vestibulum at eros

  h3#media.col-12.ml-3.mt-4 Media

  h3#modal.col-12.ml-3.mt-4 Modal
  b-button(v-b-modal.modal-1) Launch demo modal
  b-modal(id="modal-1" title="BootstrapVue")
    p.my-4 
    | hello from modal!

  h3#nav.col-12.ml-3.mt-4 Nav

  h3#navbar.col-12.ml-3.mt-4 Navbar

  h3#overlay.col-12.ml-3.mt-4 Overlay

  h3#pagination.col-12.ml-3.mt-4 Pagination

  h3#pagination-nav.col-12.ml-3.mt-4 Pagination Nav
    b-pagination-nav(
      :link-gen='pageNum => (pageNum === 1 ? "?" : "?page=${pageNum}")',
      :number-of-pages='10',
      use-router
    )

  h3#popover.col-12.ml-3.mt-4 Popover

  h3#progress.col-12.ml-3.mt-4 Progress

  h3#sidebar.col-12.ml-3.mt-4 Sidebar

  h3#skeleton.col-12.ml-3.mt-4 Skeleton

  h3#spinner.col-12.ml-3.mt-4 Spinner

  h3#table.col-12.ml-3.mt-4 Table

  h3#tabs.col-12.ml-3.mt-4 Tabs

  h3#time.col-12.ml-3.mt-4 Time

  h3#toasts.col-12.ml-3.mt-4 Toasts

  h3#tooltip.col-12.ml-3.mt-4 Tooltip
</template>

<script>
export default {
  data() {
    return {
      datepickerValue: '',
      datepickerContext: '',
      inputGrouptype: true,
      types: [
        'alert',
        'aspect',
        'avatar',
        'badge',
        'breadcrumb',
        'button',
        'group',
        'toolbar',
        'calendar',
        'card',
        'carousel',
        'collapse',
        'dropdown',
        'embed',
        'form',
        'form-checkbox',
        'form-datepicker',
        'form-file-group',
        'form-input',
        'form-radio',
        'form-rating',
        'form-select',
        'form-spinbutton',
        'form-tags',
        'form-textarea',
        'form-timepicker',
        'image',
        'input-group',
        'jumbotron',
        'layout',
        'link',
        'media',
        'modal',
        'nav',
        'navbar',
        'overlay',
        'pagination',
        'pagination-nav',
        'popover',
        'progress',
        'sidebar',
        'skeleton',
        'spinner',
        'table',
        'tabs',
        'time',
        'toasts',
        'tooltip',
      ],
    }
  },
  // computed:,
  methods: {
    onDatePickerContext(context) {
      this.datepickerContext = context
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="scss">
@import '~@/assets/styles/mixins';
@import '~@/assets/styles/globals';
.table-of-content {
  background-color: var(--indigo);
  box-shadow: 0 2px 4px #ffffff22;
  border: 0;
  position: sticky;
  top: 50px;
  z-index: 500;
}
#sidebar-right a:hover {
  color: var(--dark);
}
#sidebar-right a {
  color: var(--secondary);
}
</style>
