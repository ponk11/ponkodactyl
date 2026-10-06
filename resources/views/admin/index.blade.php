@extends('layouts.admin')

@section('title')
    Administration
@endsection

@section('content-header')
    <div class="ponk-admin-hero">
        <div>
            <p class="ponk-admin-kicker">Operations // keep one eye open</p>
            <h1>Control room</h1>
        </div>
        <div class="ponk-admin-build {{ $version->isLatestPanel() ? 'is-current' : 'is-outdated' }}">
            <span class="ponk-admin-build__light"></span>
            <span><small>BUILD STATUS</small><strong>{{ $version->isLatestPanel() ? 'Suspiciously current' : 'Update available' }}</strong></span>
        </div>
    </div>
@endsection

@section('content')
<section class="ponk-admin-metrics" aria-label="Panel totals">
    <a class="ponk-admin-metric" href="{{ route('admin.servers') }}">
        <span class="ponk-admin-metric__label"><i class="fa fa-server"></i> Servers</span>
        <strong>{{ $stats['servers'] }}</strong>
    </a>
    <a class="ponk-admin-metric" href="{{ route('admin.nodes') }}">
        <span class="ponk-admin-metric__label"><i class="fa fa-sitemap"></i> Nodes</span>
        <strong>{{ $stats['nodes'] }}</strong>
    </a>
    <a class="ponk-admin-metric" href="{{ route('admin.users') }}">
        <span class="ponk-admin-metric__label"><i class="fa fa-users"></i> Users</span>
        <strong>{{ $stats['users'] }}</strong>
    </a>
    <a class="ponk-admin-metric" href="{{ route('admin.locations') }}">
        <span class="ponk-admin-metric__label"><i class="fa fa-globe"></i> Locations</span>
        <strong>{{ $stats['locations'] }}</strong>
    </a>
</section>

<div class="ponk-admin-workbench">
    <section class="ponk-admin-workbench__actions">
        <div class="ponk-admin-section-heading">
            <div>
                <p class="ponk-admin-kicker">FAST PATHS</p>
                <h2>Make something happen</h2>
            </div>
        </div>
        <div class="ponk-admin-action-grid">
            <a class="ponk-admin-action" href="{{ route('admin.locations') }}"><i class="fa fa-globe"></i><span><strong>Set up a location</strong></span><b aria-hidden="true">&rsaquo;</b></a>
            <a class="ponk-admin-action" href="{{ route('admin.nodes.new') }}"><i class="fa fa-sitemap"></i><span><strong>Add a node</strong></span><b aria-hidden="true">&rsaquo;</b></a>
            <a class="ponk-admin-action" href="{{ route('admin.servers.new') }}"><i class="fa fa-server"></i><span><strong>Provision a server</strong></span><b aria-hidden="true">&rsaquo;</b></a>
            <a class="ponk-admin-action" href="{{ route('admin.users.new') }}"><i class="fa fa-user-plus"></i><span><strong>Create a user</strong></span><b aria-hidden="true">&rsaquo;</b></a>
            <a class="ponk-admin-action" href="{{ route('admin.nests.new') }}"><i class="fa fa-leaf"></i><span><strong>Add a nest</strong></span><b aria-hidden="true">&rsaquo;</b></a>
            <a class="ponk-admin-action" href="{{ route('admin.api.new') }}"><i class="fa fa-key"></i><span><strong>Create an API key</strong></span><b aria-hidden="true">&rsaquo;</b></a>
        </div>
    </section>
    <aside class="ponk-admin-workbench__status">
        <p class="ponk-admin-kicker">SYSTEM NOTE</p>
        <h2>Current build</h2>
        <p>
            @if ($version->isLatestPanel())
                Ponkodactyl <code>{{ config('app.version') }}</code> is suspiciously up-to-date.
            @else
                The latest panel release is <a href="https://github.com/pterodactyl/panel/releases/v{{ $version->getPanel() }}" target="_blank" rel="noopener noreferrer"><code>{{ $version->getPanel() }}</code></a>. You are running <code>{{ config('app.version') }}</code>.
            @endif
        </p>
        <a class="ponk-admin-status-link" href="https://pterodactyl.io" target="_blank" rel="noopener noreferrer"><i class="fa fa-book"></i> Open the docs</a>
        <a class="ponk-admin-status-link" href="{{ $version->getDiscord() }}" target="_blank" rel="noopener noreferrer"><i class="fa fa-comments"></i> Ask for help</a>
        <a class="ponk-admin-status-link" href="https://github.com/pterodactyl/panel" target="_blank" rel="noopener noreferrer"><i class="fa fa-github"></i> Inspect upstream</a>
    </aside>
</div>
@endsection
