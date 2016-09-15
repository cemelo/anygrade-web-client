<template>
  <dialog id="login"
    :class="{ error: hasErrorMessage, 'invalid-credentials': hasInvalidUsernamePassword }">

    <div class="wrapper">
      <div class="left-panel">
      </div>

      <div class="right-panel">
        <div class="close-button">
          <button class="mdi mdi-close" @click="close()"></button>
        </div>

        <transition name="fade">
          <div class="overlay-box" v-show="userSignedIn || loading"
              :class="{ success: userSignedIn }">
            <ag-spinner v-if="loading" color="asbestos"></ag-spinner>

            <svg v-if="userSignedIn" class="checkmark"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
              <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>

            <p class="greeting" v-if="userSignedIn">
              {{ $t('auth.greeting', {name: $user && $user.name}) }}
            </p>
          </div>
        </transition>

        <div class="dialog-content">
          <login-header :messages="messages"
            :user-email="email"
            :loading="loading"
            :view="currentView"
            @message-close="messages.splice(arguments[0], 1)">
          </login-header>

          <!-- Body -->
          <div class="login-body">
            <div class="actions">
              <button :class="{ active: isSignin }" @click="activateView('signin')">
                {{ $t('auth.signin') }}
              </button>
              <button :class="{ active: isSignup }" @click="activateView('signup')">
                {{ $t('auth.signup') }}
              </button>
            </div>

            <login-form :view="currentView" :signin-successful="userSignedIn"
              v-model="email"
              @change="updateAvatar(arguments)"
              @submit="[loading, messages] = [true, []]"
              @after-submit="onAfterSubmit()"
              @message="messages.push(arguments[0])"
              @message-close="messages.$remove(arguments[0])"
              @reset-password="activateView('reset_password')">
            </login-form>

            <!-- Separator -->
            <div class="separator">
              <hr />
              <span>ou</span>
              <hr />
            </div>

            <!-- External Providers -->
            <login-external :view="currentView"
              @submit="[loading, messages] = [true, []]"
              @after-submit="loading = false"
              @message="messages.push(arguments[0])"
              @message-close="messages.$remove(arguments[0])">
            </login-external>
          </div>

          <!-- // Footer -->
          <div class="footer">&copy; {{ (new Date()).getUTCFullYear() }} Redime</div>
        </div>
      </div>
    </div> <!-- wrapper -->
  </dialog>
</template>

<script>
import AgDialog     from '../../components/ag-dialog';
import AgFlatButton from '../../components/ag-flat-button';
import AgSpinner    from '../../components/ag-spinner';

import LoginHeader   from './login-header';
import LoginExternal from './login-external';
import LoginForm     from './login-form';

export default {
  extends: AgDialog,
  components: {
    AgFlatButton,
    AgSpinner,

    LoginHeader,
    LoginExternal,
    LoginForm,
  },

  data() {
    return {
      currentView: 'signin',
      email: null,
      messages: [],
      loading: false,
      userSignedIn: false,
    };
  },

  watch: {
    $user(newValue) {
      if (this.show && newValue) {
        this.$nextTick(() => {
          this.userSignedIn = true;

          setTimeout(() => {
            this.close();
          }, 3000);
        });
      } else {
        this.userSignedIn = false;
      }
    },
  },

  computed: {
    isSignup() {
      return this.currentView === 'signup';
    },
    isSignin() {
      return this.currentView === 'signin';
    },
    isResetPassword() {
      return this.currentView === 'reset_password';
    },
    hasErrorMessage() {
      return this.messages.filter((m) => m.type === 'error').length > 0;
    },
    hasInvalidUsernamePassword() {
      return this.messages
        .filter((m) => m.code === 'auth.error.Unauthorized').length > 0;
    },
  },

  methods: {
    activateView(view) {
      this.currentView = view;
    },

    onAfterSubmit() {
      this.loading = false;

      if (this.currentView !== 'signin') {
        this.activateView('signin');
      }
    },
  }, // methods
};
</script>

<style lang="stylus">
@require '~components/styles/palette';

#login
  width: 300px;

  .wrapper
    display: flex;
    flex-direction: row;
    // height: 450px;

  .left-panel
    background: url('/assets/login-splash.jpg') 50% 100%;
    background-size: auto 100%;
    flex-shrink: 0;
    flex-grow: 1;
    width: 300px;

    // @media only screen and (max-width: 599px)
    display: none;

  &.error
    animation: dialog-shake 0.82s cubic-bezier(.36,.07,.19,.97) both,
      ag-dialog-fade-in 0s ease-in forwards;
    animation-delay: 0.2s;
    // border: 5px solid rgba(flat-color(alizarin), 0.5);
    // border-radius: 5px;
    // transition: border 0.3s ease-in-out;
    // backface-visibility: hidden;
    // perspective: 1000px;
    transform: translate3d(0, 0, 0);

  .right-panel
    background-color: white;
    flex-shrink: 0;
    flex-grow: 1;
    width: 300px;

    /**
     * Animation by Alexander Haniotis
     */
    div.overlay-box
      align-items: center;
      background-color: rgba(255, 255, 255, 1);
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      opacity: 0.9;
      position: absolute;
      transition: opacity 0.5s ease-in-out;
      width: 100%;
      z-index: 4;

      &.success
        opacity: 1;

      &.fade-enter, &.fade-leave-active
        opacity: 0;

      .greeting
        animation: greeting-fade .5s ease-in-out .5s forwards;
        opacity: 0;

        .no-cssanimations &
          opacity: 1;

        @keyframes greeting-fade
          0%
            opacity: 0;
          100%
            opacity: 1;

      .checkmark__circle
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        stroke-width: 2;
        stroke-miterlimit: 10;
        stroke: flat-color('emerald');
        fill: none;
        animation: stroke .6s cubic-bezier(0.650, 0.000, 0.450, 1.000) 0.5s forwards;

      .checkmark
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: block;
        stroke-width: 2;
        stroke: #fff;
        stroke-miterlimit: 10;
        margin: 10% auto;
        box-shadow: inset 0px 0px 0px flat-color('emerald');
        animation: fill .4s ease-in-out .9s forwards, scale .3s ease-in-out 1.4s both;

      .checkmark__check
        transform-origin: 50% 50%;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke .3s cubic-bezier(0.650, 0.000, 0.450, 1.000) 1.2s forwards;

      @keyframes stroke
        100%
          stroke-dashoffset: 0;

      @keyframes scale
        0%, 100%
          transform: none;
        50%
          transform: scale3d(1.1, 1.1, 1);

      @keyframes fill
        100%
          box-shadow: inset 0px 0px 0px 30px flat-color('emerald');

    div.dialog-content
      background-color: transparent;
      overflow: hidden;

    div.close-button
      background: none;
      position: relative;
      z-index: 3;

      button
        color: flat-color(asbestos);
        background: white;
        font-size: 1rem;
        border: 1px solid white;
        border-radius: 10px;
        height: 20px;
        width: 20px;
        margin: 0;
        padding: 0;
        cursor: pointer;

    div.login-body
      padding: 30px 30px 0 30px

      div.actions
        display: flex;
        justify-content: center;
        // padding: 0 20px 0 20px;

        button
          background: none;
          border: 1px solid flat-color(concrete);
          color: flat-color(concrete);
          font-size: 0.65em;
          text-transform: uppercase;
          font-weight: 600;
          flex-grow: 1;
          flex-basis: 0;
          padding: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease-in-out,
            color 0.3s ease-in-out,
            border-color 0.3s ease-in-out;

          &.active
            background-color: flat-color(concrete);
            color: white;

          &:first-child
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
            border-right: 0px;

          &:last-child
            border-top-right-radius: 3px;
            border-bottom-right-radius: 3px;
            // border-left: 0px;

      div.separator
        display: flex;
        font-style: italic;
        font-size: 0.85rem;
        padding: 10px 0 0 0;

        span
          color: flat-color('silver');
          flex: 0 1 auto;
          padding: 0 10px 0 10px;

        hr
          border: none;
          background: flat-color(clouds);
          // display: none;
          flex: 1 0 auto;
          height: 1px;
          margin-top: 10px;

      div.login-form
        padding-top: 10px;

    div.footer
      color: flat-color(clouds);
      font-size: 0.6rem;
      padding-top: 10px;
      padding-bottom: 10px;

    @media (max-width: 425px)
      &
        background: white;
        font-size: 1.1em;

        div.loading-box
          border-radius: 0px;

        div.avatar
          margin-top: 10px !important;

          img
            height: 70px;
            margin-left: -35px;
            width: 70px;

        div.dialog-content
          border-radius: 0;

        div.header
          border-radius: 0;

    @media (min-width: 376px) and (max-width: 425px)
      &
        font-size: 1.25em;

  &[data-platform="other"] .close-button
    float: right;
    margin-left: -40px;
    margin-top: 8px;
    margin-right: 10px;

  &[data-platform="mac"] .close-button
    float: left;
    margin-right: -30px;
    margin-top: 8px;
    margin-left: 10px;

@keyframes dialog-shake
  10%, 90%
    transform: translate3d(-1px, 0, 0);

  20%, 80%
    transform: translate3d(2px, 0, 0);

  30%, 50%, 70%
    transform: translate3d(-4px, 0, 0);

  40%, 60%
    transform: translate3d(4px, 0, 0);
</style>
