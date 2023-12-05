---
layout: post
title: "Dynamic formsets with Alpine.js"
date: 2023-11-18
published: false
author: victor
tags:
  - Alpine.js
categories:
  - Frontend
excerpt: "How to dynamically add and remove forms in django formsets with Alpine.js"
---

```html
{% raw %}<form x-data="formset">
  <template>
    <div class="form">
      {{ formset.empty_form }}
      <button type="button" @click="deleteForm()">Delete form</button>
    </div>
  </template>
  <button type="button" @click="addForm()">Add form</button>
  {{ formset.management_form }}
  <div class="forms">
    {% for form in formset %}
    <div class="form">
      {{ form }}
      <button type="button" @click="deleteForm()">Delete form</button>
    </div>
    {% endfor %}
  </div>
</form>{% endraw %}
```

```js
Alpine.data('formset', () => ({
  init() {
    this.template = this.$root.querySelector('template')
    this.formsContainer = this.$root.querySelector('.forms')
    this.totalFormsInput = this.$root.querySelector(`input[name$='-TOTAL_FORMS']`)
    this.initialFormsInput = this.$root.querySelector('input[name$="-INITIAL_FORMS"]')
  },
  addForm() {
    const newForm = this.template.content.cloneNode(true)

    // replace __prefix__ with the correct index
    for (let el of newForm.querySelectorAll('input, select, textarea')) {
      if (el.name.includes('__prefix__')) {
        el.name = el.name.replace('__prefix__', this.formsContainer.children.length)
      }
      if (el.id.includes('__prefix__')) {
        el.id = el.id.replace('__prefix__', this.formsContainer.children.length)
      }
    }
    const labels = newForm.querySelectorAll('label')
    for (let el of labels) {
      if (el.htmlFor.includes('__prefix__')) {
        el.htmlFor = el.htmlFor.replace('__prefix__', this.formsContainer.children.length)
      }
    }

    // add the new form to the dom
    this.formsContainer.appendChild(newForm)

    // adjust the management form inputs
    this.totalFormsInput.value = parseInt(this.totalFormsInput.value) + 1
    this.initialFormsInput.value = parseInt(this.initialFormsInput.value) + 1
  },
  deleteForm() {
    // remove the element from the dom
    this.$el.closest('.form').remove()

    // adjust the ids of the remaining inputs
    for (let i = 0; i < this.formsContainer.children.length; i++) {
      const form = this.formsContainer.children[i]
      const inputs = form.querySelectorAll('input, select, textarea')
      for (let el of inputs) {
        el.name = el.name.replace(/\d+/, i)
        el.id = el.id.replace(/\d+/, i)
      }
      const labels = form.querySelectorAll('label')
      for (let el of labels) {
        el.htmlFor = el.htmlFor.replace(/\d+/, i)
      }
    }

    // adjust the management form inputs
    this.totalFormsInput.value = Math.max(0, parseInt(this.totalFormsInput.value) - 1)
    this.initialFormsInput.value = Math.min(0, parseInt(this.initialFormsInput.value) - 1)
  }
}))
```
