export default function ({ redirect, route }) {
  if (route.fullPath === '/') { redirect('/visualisation/graph') }
  if (route.fullPath === '/fr') { redirect('/fr/visualisation/graph') }
  if (route.fullPath === '/fr/') { redirect('/fr/visualisation/graph') }
  if (route.fullPath === '/graph') { redirect('/visualisation/graph') }
  if (route.fullPath === '/fr/graph') { redirect('/fr/visualisation/graph') }
}
