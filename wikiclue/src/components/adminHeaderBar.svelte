<script lang="ts">
	import logo from '$lib/images/logo.png';
	import ProfileIcon from '~icons/iconoir/profile-circle';
	import LogoutIcon from '~icons/material-symbols/logout-sharp';
	import BurgerMenuIcon from '~icons/material-symbols/menu';
	import { authHandlers } from '../store/store';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import ConfirmOverlay from './confirmOverlay.svelte';

	let showBurgerMenu = false;
	let burgerMenuOpen = false;
	const isLogoutOverlay = writable(false);

	onMount(() => {
		const mediaQuery = window.matchMedia('(max-width: 768px)');
		showBurgerMenu = mediaQuery.matches;
		const handler = (event) => {
			showBurgerMenu = event.matches;
		};
		mediaQuery.addListener(handler);
		return () => {
			mediaQuery.removeListener(handler);
		};
	});

	function toggleBurgerMenu() {
		burgerMenuOpen = !burgerMenuOpen;
	}

	async function logout() {
		isLogoutOverlay.set(false);
		await authHandlers.logout();
	}
</script>

<nav class="header-bar">
	<div id="left-align">
		<a href="/admin">
			<img src={logo} alt="WikiClue Logo" />
		</a>
	</div>
	{#if !showBurgerMenu}
		<div class="links-container">
			<button
				class="logout-button"
				title="Logout"
				on:click={() => {
					isLogoutOverlay.set(true);
				}}
			>
				<LogoutIcon style="font-size: 1.5rem; color: white; padding-top: 5px" />
			</button>
		</div>
	{:else}
		<button class="burger-menu" on:click={() => toggleBurgerMenu()}>
			<BurgerMenuIcon style="font-size: 1.5rem; color: white; padding-top: 2px" />
		</button>
		{#if burgerMenuOpen}
			<div class="burger-menu-items">
				<a href="/admin/admin-settings">Gamemaster Settings</a>
				<button
					on:click={() => {
						isLogoutOverlay.set(true);
					}}>Logout</button
				>
			</div>
		{/if}
	{/if}
	{#if $isLogoutOverlay}
		<ConfirmOverlay
			header="Logout "
			onClose={() => {
				isLogoutOverlay.set(false);
			}}
			popupText={'Please confirm you would like to logout'}
			onCancel={() => {
				isLogoutOverlay.set(false);
			}}
			onConfirm={() => logout()}
		/>
	{/if}
</nav>

<style>
	@import '../styles/componentStyles/headerBarStyles.css';
</style>
