<template>
  <div id="user-menu" :class="{ 'active' : active }">
    <transition name="appear">
      <div class="profile-popup" v-if="active">
        <div class="info">
          <div>
            <div unselectable="on" class="name">{{ $user.name }}</div>
            <div>
              <ag-dropdown class="status-select"
                :options="options" v-model="userStatus">
              </ag-dropdown>
            </div>
          </div>

          <div class="actions">
            <router-link :to="{ path: '/profile' }">
              <span class="mdi mdi-account"></span>
              <span class="label">{{ $t('user_menu.profile') }}</span>
            </router-link>
            <a href="#" @click="logout()">
              <span class="mdi mdi-logout-variant"></span>
              <span class="label">{{ $t('user_menu.logout') }}</span>
            </a>
          </div>
        </div>

        <div class="notifications">
          <h1>{{ $t('user_menu.notifications') }}</h1>

          <ul class="notifications-list">
            <li>
              <div class="image">
                <span class="mdi mdi-check"></span>
              </div>
              <div class="content">
                <span class="title">Notification</span>
                <span class="date">14/12/2015 11:25</span>

                <span  class="text">Descrição da notificação</span>
              </div>
            </li>
            <li>
              <div class="image">
                <span class="mdi mdi-check"></span>
              </div>
              <div class="content">
                <span class="title">Notification</span>
                <span class="date">14/12/2015 11:25</span>

                <span  class="text">Descrição da notificação</span>
              </div>
            </li>
            <li>
              <div class="image">
                <span class="mdi mdi-check"></span>
              </div>
              <div class="content">
                <span class="title">Notification</span>
                <span class="date">14/12/2015 11:25</span>

                <span  class="text">Descrição da notificação</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <button class="user-picture" @click.stop="activate()">
      <img :src="$user.image" :title="$t('user.picture_title')"
        @error="renderDefaultUserAvatar()" />
    </button>

    <div unselectable="on" class="notifications-indicator">
      <div unselectable="on">5</div>
    </div>

    <!-- <div class="drop-arrow mdi"
      :class="{ 'mdi-chevron-down': !active, 'mdi-chevron-up': active }"
      @click.stop="activate()">
    </div> -->
  </div>
</template>

<script>
import AgDropdown from '../../components/ag-dropdown';
import LayerStack from '../../components/util/layer-stack';

export default {
  components: { AgDropdown },

  data() {
    return {
      active: false,
      avatar: null,
      userStatus: null,
      options: [
        {
          label: this.$t('user_menu.status.available'),
          imageClass: ['status', 'online'],
          value: 'online',
          selected: true,
        },
        {
          label: this.$t('user_menu.status.busy'),
          imageClass: ['status', 'busy'],
          value: 'busy',
        },
        {
          label: this.$t('user_menu.status.invisible'),
          imageClass: ['status', 'invisible'],
          value: 'invisible',
        },
      ],
    };
  },

  watch: {
    userStatus(newValue) {
      for (const option of this.options) {
        if (newValue.value === option.value) {
          option.selected = true;
        } else {
          option.selected = false;
        }
      }
    },
  },

  methods: {
    activate() {
      this.active = !this.active;
      this.$emit('click');

      if (this.active) {
        LayerStack.push(this.$el, () => { this.active = false; });
      }
    },

    logout() {
      this.$auth.logout();
    },

    renderDefaultUserAvatar() {
      this.$user.image = this.$user.default_image;
    },
  },

  mounted() {
  },
};
</script>

<style lang="stylus">
@require "~components/styles/devices";
@require "~components/styles/palette";

$header-color = flat-color(belize-hole);
$base-color = flat-color(wet-asphalt);

div#user-menu
  font-size: 0.9em;

  @media screen and (max-width: $iPhone-6S-Plus)
    font-size: 1.1em;

  h1
    font-size: 0.9em;
    font-weight: 600;

  button
    cursor: pointer
    color: white

  div.notifications-indicator
    border-radius: 4px;
    border: 2px solid $header-color;
    cursor: default;
    margin-top: 3px;
    margin-right: 42px;
    position: absolute;
    right: 0px;
    top: 0px;
    user-select: none;

    > div
      background-color: flat-color(alizarin);
      border: 1px solid white;
      border-radius: 2px;
      color: white;
      font-family: "Open Sans";
      font-size: 0.5rem;
      padding: 0 3px 0 3px;

  button.user-picture
    background-color: white;
    border: 2px solid white;
    border-radius: 50%;
    height: 30px;
    margin: 0;
    overflow: hidden;
    padding: 0;
    width: 30px;

    > img
      border-radius: 50%;
      height: 100%;
      width: 100%;

    &:active > img
      opacity: 0.7;

  div.drop-arrow
    background-color: flat-color(peter-river);
    border-radius: 50%;
    box-sizing: border-box;
    color: white;
    cursor: pointer;
    height: 15px;
    margin-top: calc(22px - 8px);
    margin-right: 10px;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
    width: 15px;

    &:active, &:focus
      background-color: lighten(flat-color(peter-river), 20%);

    &:before
      display: block;
      width: 16px;
      font-size: 1em;
      line-height: 1.1em;

  div.profile-popup
    background-color: $base-color; //darken(flat-color(belize-hole), 20%);
    box-sizing: border-box;
    color: flat-color(clouds);
    opacity: 1;
    padding: 25px;
    position: absolute;
    right: 0;
    top: 44px;
    transition: opacity 0.15s ease-in-out, transform 0.15s ease-in-out;
    width: 350px;

    a
      color: flat-color(clouds);

    &:before
      border-bottom: 5px solid $base-color; //darken(flat-color(belize-hole), 20%);
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      content: "";
      margin-right: 30px;
      margin-top: -5px;
      position: absolute;
      right: 0;
      top: 0%;
      z-index: 5;

    &.appear-enter, &.appear-leave-active
      opacity: 0;

    .info
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      padding-bottom: 25px;

      @media screen and (max-width: $iPhone-6S-Plus)
        border-bottom: 1px solid lighten(flat-color(asbestos), 70%);

      > div:first-child
        flex-basis: 0;
        flex-grow: 1;
        flex-shring: 0;

      .name
        cursor: default;
        font-weight: 300;
        margin-bottom: 0px;
        user-select: none;

      .status
        border-radius: 50%;
        display: inline-block;
        height: 7px;
        margin-right: 2px;
        width: 7px;

        &.online
          background-color: flat-color(emerald);

        &.busy
          background-color: flat-color(alizarin);

        &.invisible
          background-color: flat-color(concrete);

      .status-select
        color: flat-color(clouds);
        font-size: 0.65em;
        text-transform: uppercase;

        .label .status
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);

        > *
          cursor: pointer !important;

        .dropdown
          margin-left: -13px;
          // width: 20em;

          @media screen and (max-width: $iPhone-6S-Plus)
            box-shadow: none;

            @supports (backdrop-filter: blur(0))
              background-color: rgba(255, 255, 255, 0.4);
              backdrop-filter: blur(5px);

    div.actions
      > a
        display: flex;
        justify-items: center;
        margin-bottom: 5px;

        &:last-child
          margin-bottom: 0;

      .mdi
        color: lighten($base-color, 50%);
        font-size: 1em;
        margin-right: 5px;

      .label
        font-size: 0.65em;
        margin-top: 1px;
        text-transform: uppercase;

    @media screen and (max-width: $iPhone-6S-Plus)
      background-color: flat-color(clouds);
      box-shadow: inset 0 8px 5px -5px rgba(0, 0, 0, 0.2);
      color: lighten(black, 50%);
      height: calc(100vh - 44px);
      margin: 0;
      width: 100vw;

      a
        color: lighten(black, 50%);

      &:before
        border-bottom-color: transparent;

      &.appear-enter, &.appear-leave-active
        opacity: 1;
        transform: translateX(100%);

      div.actions .mdi
        color: lighten(flat-color(belize-hole), 20%);

      .info .status-select
        color: flat-color(concrete);

  .notifications
    padding-top: 10px;

    ul.notifications-list
      list-style-type: none;
      margin: 20px 0 0 0;
      padding: 0;
      overflow-y: auto;
      max-height: 100px;

      li
        display: flex;
        padding-top: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid darken($base-color, 10%);

        &:first-child
          padding-top: 0;

        &:last-child
          padding-bottom: 0;
          border-bottom: 1px solid transparent;

        .image
          display: flex;
          background-color: lighten($base-color, 10%);
          flex-shrink: 0;
          width: 30px;
          height: 30px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin-top: 3px;
          margin-right: 10px;

        .content
          > *
            display: block;

          .title
            font-size: 0.85em;

          .date
            color: lighten($base-color, 40%);
            font-size: 0.7em;

          .text
            color: lighten($base-color, 70%);
            font-size: 0.8em;
            margin-top: 10px;
</style>
