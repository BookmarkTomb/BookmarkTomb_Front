<template>
  <div style="height: 100%">
    <bookmark-tomb-appbar/>

    <bookmark-tomb-drawer/>

    <bookmark-tomb-view/>
  </div>
</template>

<script>
export default {
  name: 'DashboardIndex',
  components: {
    BookmarkTombAppbar: () => import('@/views/cores/AppBar'),
    BookmarkTombDrawer: () => import('@/views/cores/Drawer'),
    BookmarkTombView: () => import('@/views/cores/View')
  }
}
</script>
