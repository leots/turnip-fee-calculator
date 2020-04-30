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
      <!--Fee type-->
      <b-col sm="1">
        <label>Fee Type</label>
      </b-col>
      <b-col sm="2">
        <b-form-select v-model="offer.feeType" :options="feeTypes"></b-form-select>
      </b-col>

      <!--Fee amount-->
      <b-col sm="2">
        <label>Fee Amount</label>
      </b-col>
      <b-col sm="2">
        <b-form-input v-model="offer.feeAmount" type="number"></b-form-input>
      </b-col>

      <!--Selling price-->
      <b-col sm="2">
        <label>Selling price</label>
      </b-col>
      <b-col sm="2">
        <b-form-input v-model="offer.sellingPrice" type="number"></b-form-input>
      </b-col>

      <!--Delete btn-->
      <b-col sm="1">
        <b-btn variant="danger" size="sm" @click="offers = offers.filter(e => e !== offer)">
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
        {{ profit(offer) }}
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
          feeType: 'nmt',
          feeAmount: 1,
          sellingPrice: null,
        },
      );
    },
    profit(offer) {
      // - bells spent on turnips
      // - fee
      // + turnips * price
      const turnips = parseInt(this.numberOfTurnips, 10);
      const turnipPrice = parseInt(offer.sellingPrice, 10);
      const feeBells = offer.feeType === 'nmt' ? offer.feeAmount * this.bellsPerNMT : offer.feeAmount;

      return (turnips * turnipPrice) - feeBells - (this.turnipCost * this.numberOfTurnips);
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
