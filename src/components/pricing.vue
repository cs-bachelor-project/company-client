<template>
  <div class="row">
    <div class="col-md-12">
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
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 mb-5">
          <router-link
            :to="{name: 'register'}"
            class="btn btn-primary btn-lg btn-block"
          >Sign up now for free</router-link>
        </div>
      </div>
    </div>
  </div>
</template>