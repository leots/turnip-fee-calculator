<template>
  <div class="home">
    <b-row>
      <b-col>
        <b-card title="">
          <template v-slot:header>
            <h4 class="mb-0">Owned Turnips</h4>
          </template>

          <b-row>
            <b-col sm="3">
              <label for="number-of-turnips"># of turnips:</label>
            </b-col>
            <b-col sm="3">
              <b-form-input id="number-of-turnips" v-model="numberOfTurnips" type="number">
              </b-form-input>
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
        </b-card>
      </b-col>
    </b-row>


    <!--todo: add fee paid for buying turnips-->
    <!--todo: add quick calculation for selected turnip price * turnips amount gia na vlepeis posa
    na kaneis withdraw apo to ABD-->

    <!--Offers-->
    <b-row>
      <b-col>
        <b-card>
          <!--Card title-->
          <template v-slot:header>
            <b-row class="card-header-row">
              <b-col>
                <h4 class="mb-0">Offers</h4>
              </b-col>
              <b-col class="new-offer-col">
                <b-btn variant="success" @click="newOffer" size="sm">
                  <b-icon-plus/>
                  New offer
                </b-btn>
              </b-col>
            </b-row>
          </template>

          <offer v-for="offer in offers"
                 :key="offer.key"
                 @delete="offers = offers.filter(e => e !== offer)"
                 :offer="offer">
          </offer>
        </b-card>
      </b-col>
    </b-row>


    <!--Profit results per offer-->
    <b-row>
      <b-col>
        <h3>Results</h3>
      </b-col>
    </b-row>

    <b-row v-for="offer in offers" :key="'result' + offer.key">
      <b-col>
        <b>{{ offer.name }}</b> Profit
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
import Offer from '@/components/Offer.vue';

export default {
  name: 'Home',
  components: {
    TurnipChart,
    Offer,
  },
  data() {
    return {
      numberOfTurnips: 4000,
      bellsPerNMT: 100000,
      turnipCost: 95,
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

  .row:last-child {
    margin-bottom: 0;
  }

  .row.card-header-row {
    margin-bottom: 0;
  }

  .new-offer-col {
    text-align: right;
  }
</style>
