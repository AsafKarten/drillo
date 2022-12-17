import { mount } from '@vue/test-utils'
import HomePage from '@/views/HomePage.vue'
import Login from '@/views/Login.vue'

describe('Login.vue', () => {
  it('renders home vue', () => {
    const wrapper = mount(Login)
    expect(wrapper.text()).toMatch('Ready to create an app?')
  })
})
