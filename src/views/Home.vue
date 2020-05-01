<template>
  <div class="home">
    <b-row>
      <b-col sm="3">
        <label for="number-of-turnips"># of turnips:</label>
      </b-col>
      <b-col sm="3">
        <b-form-input id="number-of-turnips" v-model="numberOfTurnips" type="number"></b-form-input>
      </b-col>
      <b-col sm="3">
        <label for="cost-of-turnips">Cost of 1 turnip: {{ turnipCost }} Bells</label>
      </b-col>
      <b-col sm="3">
        <b-form-input id="cost-of-turnips"
                      v-model="turnipCost"
                      min="85"
                      max="100"
                      type="range"></b-form-input>
      </b-col>
    </b-row>

    <b-row>
      <b-col sm="3">
        <label for="bells-per-nmt">Price of a NMT in bells:</label>
      </b-col>
      <b-col sm="9">
        <b-form-input id="bells-per-nmt" v-model="bellsPerNMT" type="number"></b-form-input>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <h3>Offers</h3>
      </b-col>
      <b-col class="new-offer-col">
        <b-btn variant="success" @click="newOffer">
          <b-icon-plus/>
          New offer
        </b-btn>
      </b-col>
    </b-row>

    <b-row v-for="offer in offers" :key="offer.key">
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
        <b-btn variant="danger" @click="offers = offers.filter(e => e !== offer)">
          <b-icon-trash/>
        </b-btn>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <h3>Results</h3>
      </b-col>
    </b-row>

    <b-row v-for="offer in offers" :key="'result' + offer.key">
      <b-col>
        Profit
      </b-col>
      <b-col>
        {{ profit(offer).toLocaleString() }}
      </b-col>
    </b-row>

    <b-row>
      <b-col offset="2" cols="8">
        <turnip-chart>
        </turnip-chart>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// @ is an alias to /src
import TurnipChart from '@/components/TurnipChart.vue';

export default {
  name: 'Home',
  components: {
    TurnipChart,
  },
  data() {
    return {
      numberOfTurnips: 4000,
      bellsPerNMT: 100000,
      turnipCost: 95,
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
      offers: [],
    };
  },
  methods: {
    newOffer() {
      this.offers.push(
        {
          key: this.offers.length > 0 ? this.offers[this.offers.length - 1].key + 1 : 0,
          name: '',
          feeType: 'nmt',
          feeAmount: 1,
          sellingPrice: null,
        },
      );
    },
    profit(offer) {
      // Calculate how many inventory slots the fee will take up so we know how many turnips
      // we can carry & sell
      let feeSlots = 0;
      const feeAmount = parseInt(offer.feeAmount, 10);
      if (offer.feeType === 'nmt') {
        // Every 10 NMT we take up one inventory slot
        feeSlots = Math.ceil(feeAmount / 10);
      } else if (offer.feeType === 'bells' && feeAmount > 99000) {
        // For every 99k bells after the 1st 99k, we take up an inventory slot
        feeSlots = Math.ceil((feeAmount - 99000) / 99000);
      }

      // Find out the amount of turnips we can sell based on the inventory slots
      const turnips = parseInt(this.numberOfTurnips, 10);
      const maxSellableTurnips = 4000 - (feeSlots * 100);
      const sellableTurnips = turnips < maxSellableTurnips ? turnips : maxSellableTurnips;

      const turnipPrice = parseInt(offer.sellingPrice, 10);
      const feeBells = offer.feeType === 'nmt' ? offer.feeAmount * this.bellsPerNMT : offer.feeAmount;

      // Calculate final amount:
      // - bells spent on turnips
      // - fee
      // + turnips we can carry * price
      return (sellableTurnips * turnipPrice) - feeBells - (this.turnipCost * this.numberOfTurnips);
    },
  },
};
</script>

<style scoped>
  .row {
    margin-bottom: 10px;
  }

  .new-offer-col {
    text-align: right;
  }
</style>
