<template>
  <div>
    <loading v-if="!meta.ready" />

    <div v-show="meta.ready">
      <div class="row mb-5" v-if="entry.nickname">
        <div class="col-md-12">
          <h1 class="mb-0">
            Your current subscription:
            <strong>{{entry.nickname}}</strong>
          </h1>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <h2 class="mb-0">Choose a subscription plan</h2>
          <div class="row">
            <div class="col-md-4 mb-5">
              <div class="card mb-5">
                <div class="card-header">
                  <h4 class="my-0">Freemium</h4>
                </div>
                <div class="card-body">
                  <h1 class="card-title">Free</h1>
                  <ul class="list-unstyled">
                    <li>Unlimited tasks</li>
                    <li>Unlimited administrators and managers</li>
                    <li>Up to 5 drivers</li>
                  </ul>
                  <input class="form-control" type="radio" id="subscription" value="plan_HDtLlsSL3sqIYg" v-model="data.subscription">
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-5">
              <div class="card mb-5">
                <div class="card-header">
                  <h4 class="my-0">Lite</h4>
                </div>
                <div class="card-body">
                  <h1 class="card-title">
                    DKK 100
                    <small class="text-muted">/ mo</small>
                  </h1>
                  <ul class="list-unstyled">
                    <li>Unlimited tasks</li>
                    <li>Unlimited administrators and managers</li>
                    <li>Up to 15 drivers</li>
                  </ul>
                  <input class="form-control" type="radio" id="subscription" value="plan_HDtLX0PusTLGI0" v-model="data.subscription">
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-5">
              <div class="card mb-5">
                <div class="card-header">
                  <h4 class="my-0">Premium</h4>
                </div>
                <div class="card-body">
                  <h1 class="card-title pricing-card-title">
                    DKK 250
                    <small class="text-muted">/ mo</small>
                  </h1>
                  <ul class="list-unstyled">
                    <li>Unlimited tasks</li>
                    <li>Unlimited administrators and managers</li>
                    <li>Up to 50 drivers</li>
                  </ul>
                  <input class="form-control" type="radio" id="subscription" value="plan_HDtMYrR7fKDDkh" v-model="data.subscription">
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12" v-if="entry.nickname && data.subscription"><button class="btn btn-primary btn-lg btn-block" @click="changeSubscription">Change Subscription</button></div>
          </div>

          <div v-show="!entry.nickname && data.subscription">
            <h2 class="mb-3">Payment Information</h2>
            <div class="row">
              <div class="col-md-12">
                <form id="payment-form">
                  <div class="form-row">
                    <div id="card-element"></div>

                    <div id="card-errors" role="alert"></div>
                  </div>

                  <hr class="mb-3" />
                  <button class="btn btn-primary btn-lg btn-block" type="submit">Pay</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";

export default {
  data() {
    return {
      entry: {},
      data: {
        subscription: '',
        payment: {}
      }
    };
  },
  mounted() {
    this.initStripeElements();
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.meta.ready = false

      try {
        let res = await this.$axios.get("companies/subscriptions");
        this.entry = res.data;
        this.meta.ready = true
      } catch (error) {
        error.response.data.errors.forEach(e =>
          this.$toast.error(e, { timeout: false })
        );
      }
    },
    async initStripeElements() {
      const stripe = await loadStripe(process.env.VUE_APP_STRIPE_KEY);

      let elements = stripe.elements();

      let card = elements.create("card", { hidePostalCode: true });
      card.mount("#card-element");

      card.addEventListener("change", event => {
        let displayError = document.getElementById("card-errors");

        if (event.error) {
          displayError.textContent = event.error.message;
        } else {
          displayError.textContent = "";
        }
      });

      let form = document.getElementById("payment-form");
      form.addEventListener("submit", event => {
        event.preventDefault();

        stripe.createToken(card).then(result => {
          if (result.error) {
            let errorElement = document.getElementById("card-errors");
            errorElement.textContent = result.error.message;
          } else {
            stripe
              .createPaymentMethod({
                type: result.token.type,
                card: card
              })
              .then(paymentMethod => {
                this.data.payment = paymentMethod.paymentMethod;

                this.subscribe();
              });
          }
        });
      });
    },
    async subscribe() {
      let loading = this.$toast("Loading...", { position: "top-left" });

      try {
        let res = await this.$axios.post("companies/subscriptions", this.data);

        this.$toast.clear(loading);
        this.$toast.success(res.data.message);
        this.$router.push('users')
      } catch (error) {
        this.$toast.clear(loading);
        error.response.data.errors.forEach(e =>
          this.$toast.error(e, { timeout: false })
        );
      }
    },
    async changeSubscription() {
      let loading = this.$toast("Loading...", { position: "top-left" });

      try {
        let res = await this.$axios.patch("companies/subscriptions", this.data);

        this.$toast.clear(loading);
        this.$toast.success(res.data.message);
        this.$router.push('users')
      } catch (error) {
        this.$toast.clear(loading);
        error.response.data.errors.forEach(e =>
          this.$toast.error(e, { timeout: false })
        );
      }
    }
  }
};
</script>

<style>
/**
 * The CSS shown here will not be introduced in the Quickstart guide, but shows
 * how you can use CSS to style your Element's container.
 */
.StripeElement {
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 5px 1px #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>