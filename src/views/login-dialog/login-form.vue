<template>
  <form class="login-form" @submit.prevent="postAction()">
    <!-- Fullname -->
    <transition name="expand">
    <div class="input" v-show="isSignup">
      <transition name="expand">
      <input class="login-fullname" :placeholder="$t('auth.form.fullname')"
        v-model="fullname" v-if="isSignup" />
      </transition>

      <transition name="expand">
        <span class="image mdi mdi-account" v-if="isSignup"></span>
      </transition>
    </div>
    </transition>

    <!-- <transition name="expand">
      <div class="validation-message error-message" transition="expand"
        v-if="isSignup && $validation.fullname.dirty && $validation.fullname.invalid">
        <div v-if="$validation.fullname.required">
          {{ $t('auth.error.fullname_required') }}
        </div>
      </div>
    </transition> -->

    <!-- E-mail -->
    <div class="input">
      <input class="login-email" type="email" :placeholder="$t('auth.form.email')"
        v-model="email" /> <!-- v-validate:email="['required', 'email']" /> -->
      <span class="image mdi mdi-email"></span>
    </div>

    <!-- <transition name="expand">
    <div class="validation-message error-message" transition="expand"
        v-if="$validation.email.touched && $validation.email.invalid">
      <div v-if="$validation.email.required">
        {{ $t('auth.error.email_required') }}
      </div>
      <div v-if="!$validation.email.required && $validation.email.email">
        {{ $t('auth.error.invalid_email') }}
      </div>
    </validation-message>
    </transition> -->

    <!-- Password -->
    <div class="input">
      <transition name="expand">
        <input class="login-password" type="password" :placeholder="$t('auth.form.password')"
          v-model='password' v-if="!isResetPassword" /> <!-- v-validate:password="['required']" /> -->
      </transition>
      <transition name="expand">
        <span class="image mdi mdi-key" v-if="!isResetPassword"></span>
      </transition>
    </div>
    </transition>

    <!-- <transition name="expand">
    <div class="validation-message error-message"
        v-if='!isResetPassword && $validation.password.touched && $validation.password.invalid'>
      <div v-if='$validation.password.required'>
        {{ $t('auth.error.password_required') }}
      </div>
    </div>
    </transition> -->

    <ag-flat-button class="submit-button" :color="isSignin ? 'emerald' : 'carrot'"
      :shadow="true" type="submit" tabindex="4">
      {{ $t(`auth.${view}`) }}
    </ag-flat-button>

    <transition name="expand">
      <div class="lost-password" v-if="isSignin">
        <button type="button" @click='$emit("reset-password")'>
          {{ $t('auth.form.forgot_password') }}
        </button>
      </div>
    </transition>
  </form>
</template>

<script>
import _ from 'lodash';

import AgFlatButton from '../../components/ag-flat-button';

export default {
  components: { AgFlatButton },
  props: {
    view: {
      type: String,
      required: true,
    },

    signinSuccessful: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      fullname: null,
      email: null,
      password: null,
    };
  },

  computed: {
    isSignup() {
      return this.view === 'signup';
    },
    isSignin() {
      return this.view === 'signin';
    },
    isResetPassword() {
      return this.view === 'reset_password';
    },
  },

  watch: {
    email: _.debounce(function watchEmail(newValue) {
      this.$emit('input', newValue);
    }, 1000),

    view(newView) {
      this.$nextTick(() => {
        switch (newView) {
          case 'signin':
            this.$el.getElementsByTagName('INPUT')[1].focus();
            break;
          default:
            this.$el.getElementsByTagName('INPUT')[0].focus();
        }
      });
    },

    signinSuccessful(newValue) {
      if (newValue) {
        this.password = '';
        this.fullname = '';
      }
    },
  },

  methods: {
    postAction() {
      this.$emit('submit');
      if (typeof this[this.view] === 'function') {
        this[this.view]();
      }
    },

    signin() {
      this.$auth
        .login(this.email, this.password)
        .then((user) => {
          this.$emit('after-submit', user);
        })
        .catch((error) => {
          this.$emit('after-submit');
          this.$emit('message', {
            type: 'error',
            code: `auth.error.${error.message}`,
          });
        });
    },

    signup() {
      this.$auth
        .signup(this.fullname, this.email, this.password)
        .then(() => {
          this.$emit('after-submit');
          this.$emit('message', {
            type: 'info',
            code: 'auth.message.signup_successful',
          });
        })
        .catch((error) => {
          this.$emit('after-submit');
          this.$emit('message', {
            type: 'error',
            code: `auth.error.${error.message}`,
          });
        });
    },

    resetPassword() {
      this.$auth
        .resetPassword(this.email)
        .then(() => {
          this.$emit('after-submit');
          this.$emit('message', {
            type: 'info',
            code: 'auth.message.password_reset',
          });
        })
        .catch((error) => {
          this.$emit('after-submit');
          this.$emit('message', {
            type: 'error',
            code: `auth.error.${error.message}`,
          });
        });
    },
  },
};
</script>

<style lang="stylus">
@require '~components/styles/palette';

.login-form
  display: flex;
  align-items: stretch;
  flex-direction: column;
  padding-top: 20px;

  > *
    margin-bottom: 10px;

    &.input
      transition: margin .2s ease-in-out;

      &.expand-enter, &.expand-leave-active
        margin: 0px;

      & > input, & > span.image
        max-height: 29px;
        overflow: hidden;
        transform: scaleY(1);
        transform-origin: top;
        transition: all .2s ease-in-out;

        &.expand-enter, &.expand-leave-active
          margin-top: -10px;
          max-height: 0px;
          overflow: hidden;
          transform: scaleY(0);
          transform-origin: top;

  .validation-message
    border-radius: 3px;
    font-size: 0.7em;
    margin-top: -5px;
    max-height: 40px;
    overflow: visible !important;
    position: relative;
    transform: scaleY(1);
    transform-origin: top;
    transition: max-height .4s ease-in-out,
      transform .4s ease-in-out,
      margin .4s ease-in-out;

    &:before
      content: "";
      position: absolute;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      top: 0%;
      left: 50%;
      margin-left: -5px;

    &:before
      border-bottom: 5px solid transparent;
      margin-top: -5px;
      z-index: 5;

    &.expand-enter, &.expand-leave-active
      margin-top: -10px;
      max-height: 0px;
      overflow: hidden;
      transform: scaleY(0);
      transform-origin: top;

    div
      padding: 3px 5px 5px 5px;
      text-align: left;

      &:empty
        display: none;

  .error-message
    color: white;
    background-color: flat-color(alizarin);

    &:before
      border-bottom-color: flat-color(alizarin);

  > div
    display: flex;

    > span.image
      border: 1px solid flat-color('silver');
      border-right: none;
      border-radius: 3px 0 0 3px;
      box-sizing: border-box;
      color: flat-color('silver');
      flex: 0 1 auto;
      font-size: 1.125em;
      line-height: 1.625em;
      order: 1;
      padding: 0;
      vertical-align: middle;
      width: 1.625em;

      &::before
        position: relative;
        top: -1px;

    > input
      appearance: none;
      border: 1px solid flat-color('silver');
      border-left: none;
      border-radius: 0 3px 3px 0;
      color: flat-color(concrete);
      flex: 1 0 auto;
      font-size: 0.857em;
      line-height: 1.5em;
      order: 2;
      padding-left: 5px;

      // & + span.image
      //   transition: color .4s ease-in-out,
      //     background-color .4s ease-in-out,
      //     border .4s ease-in-out;

      &::placeholder
        color: flat-color('silver');
        font-style: italic;

      .invalid-credentials &
        border-color: flat-color(alizarin);

        &::placeholder
          color: flat-color(alizarin);

        & + span.image
          border-color: flat-color(alizarin);
          color: flat-color(alizarin);

      &:focus
        border-color: flat-color(belize-hole);

        & + span.image
          border-color: flat-color(belize-hole);
          color: flat-color(belize-hole);
          // color: white;

  button.ag-flat-button
    margin-top: 10px;

    .button-content
      cursor: pointer;

  div.lost-password
    display: block;
    font-size: 0.8em;
    margin-top: 10px;
    max-height: 1.2em;
    overflow: hidden;
    text-align: center;
    transform: scaleY(1);
    transform-origin: top;
    transition: max-height .2s ease-in-out,
      transform .2s ease-in-out,
      margin .2s ease-in-out;
    margin-top: 10px;

    &.expand-enter, &.expand-leave-active
      margin-top: 0px;
      margin-bottom: 0px;
      max-height: 0px;
      overflow: hidden;
      transform: scaleY(0);
      transform-origin: top;

    &.expand-leave-active
      transform-origin: bottom;

    button
      background: none;
      border: none;
      color: flat-color(asbestos);
      cursor: pointer;
</style>
