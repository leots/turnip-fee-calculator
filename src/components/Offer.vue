<template>
  <b-row>
    <!--Name-->
    <b-col cols="3">
      <b-row>
        <b-col cols="4">
          <label>User</label>
        </b-col>
        <b-col cols="8">
          <b-form-input v-model="offer.name" type="text"></b-form-input>
        </b-col>
      </b-row>
    </b-col>

    <!--Fee amount & type-->
    <b-col cols="4">
      <b-row>
        <b-col cols="2">
          <label>Fee</label>
        </b-col>

        <!--Amount-->
        <b-col cols="5">
          <b-form-input v-model="offer.feeAmount" type="number"></b-form-input>
        </b-col>

        <!--Type-->
        <!--todo: this could be made into a dropdown merged with the amount...-->
        <b-col cols="5">
          <b-form-select v-model="offer.feeType" :options="feeTypes"></b-form-select>
        </b-col>
      </b-row>
    </b-col>

    <!--Selling price-->
    <b-col cols="4">
      <b-row>
        <b-col cols="5">
          <label>Selling price</label>
        </b-col>
        <b-col cols="7">
          <b-input-group>
            <template v-slot:append>
              <b-input-group-text>
                <b-icon-bell></b-icon-bell>
              </b-input-group-text>
            </template>
            <b-form-input v-model="offer.sellingPrice" type="number"></b-form-input>
          </b-input-group>
        </b-col>
      </b-row>
    </b-col>

    <!--Delete btn-->
    <b-col cols="1">
      <b-btn variant="danger" @click="$emit('delete')">
        <b-icon-trash/>
      </b-btn>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'Offer',
  props: {
    offer: Object,
  },
  data() {
    return {
      feeTypes: [
        {
          value: 'nmt',
          text: 'NMT',
        },
        {
          value: 'bells',
          text: 'Bells',
        },
      ],
    };
  },
};
</script>

<style scoped>

</style>
