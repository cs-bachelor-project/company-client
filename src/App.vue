<template>
  <div id="app">
    <div class="progress" v-if="$store.state.loading">
      <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
    </div>

    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="#">Fixed navbar</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link :to="{name: 'index'}" class="nav-link">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'users'}" class="nav-link">Users</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'tasks'}" class="nav-link">Tasks</router-link>
            </li>
          </ul>
          <ul class="navbar-nav float-right">
            <li class="nav-item" v-if="!isLoggedIn()">
              <router-link :to="{name: 'login'}" class="nav-link">Login</router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn()">
              <router-link :to="{name: 'settings'}" class="nav-link">Settings</router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn()">
              <a href="" class="nav-link" @click.prevent="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <alerts :type="$store.state.alerts.type" :data="$store.state.alerts.data" v-if="$store.state.alerts.data!=''" />

    <main role="main" class="container">
      <div class="card">
        <div class="card-body">
          <router-view></router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss">
.card {
  top: 50px;
}
.progress, .progress-bar {
  position: fixed;
  width: 100%;
  height: 7px !important;
  z-index: 9999;
  border-radius: 0;
}
</style>