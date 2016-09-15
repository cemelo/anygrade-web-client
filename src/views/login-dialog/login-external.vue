<template>
<div class="external-login-provider">
  <ag-flat-button class="login-facebook" image='facebook' color='#3B5998' text-align="left"
    @click.native="externalProviderSignin('facebook')" :shadow="false" kind="outline">
    {{ $t(`auth.external.${view}`, { provider: 'Facebook' }) }}
  </ag-flat-button>
  <ag-flat-button class="login-google" image='google' color='#D34836' text-align="left"
    @click.native="externalProviderSignin('google')" :shadow="false" kind="outline">
    {{ $t(`auth.external.${view}`, { provider: 'Google' }) }}
  </ag-flat-button>
</div>
</template>

<script>
import AgFlatButton from '../../components/ag-flat-button';

export default {
  components: { AgFlatButton },
  props: ['view'],
  methods: {
    externalProviderSignin(provider) {
      this.$emit('submit');
      this.$auth.oAuthLogin(provider);
    },
  },
};
</script>

<style lang="stylus" scoped>
@require '~components/styles/palette';

div.external-login-provider
  font-size: 0.8em;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 20px 0 10px 0;

  button
    margin-bottom: 10px;
    cursor: pointer;

    &:last-child
      margin-bottom: 0;
</style>
