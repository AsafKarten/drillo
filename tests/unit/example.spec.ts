import { mount } from '@vue/test-utils'
import HomePage from '@/views/HomePage.vue'
import Login from '@/views/Login.vue'
import App from '@/App.vue'

describe('App.vue', () => {
  it('renders home vue', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toMatch('Ready to create an app?')
  })
})
