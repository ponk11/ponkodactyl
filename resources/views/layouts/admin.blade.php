<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>{{ config('app.name', 'Ponkodactyl') }} - @yield('title')</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
        <meta name="_token" content="{{ csrf_token() }}">

        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/svg+xml" href="/favicons/ponkodactyl.svg?v=1.15.1" sizes="any">
        <link rel="manifest" href="/favicons/manifest.json">
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#83e878">
        <link rel="shortcut icon" href="/favicons/ponkodactyl.svg?v=1.15.1">
        <meta name="msapplication-config" content="/favicons/browserconfig.xml">
        <meta name="theme-color" content="#0b1b14">

        @include('layouts.scripts')

        @section('scripts')
            {!! Theme::css('vendor/select2/select2.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/bootstrap/bootstrap.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/admin.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/adminlte/colors/skin-blue.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/sweetalert/sweetalert.min.css?t={cache-version}') !!}
            {!! Theme::css('vendor/animate/animate.min.css?t={cache-version}') !!}
            {!! Theme::css('css/pterodactyl.css?t=' . substr(sha1_file(public_path('themes/pterodactyl/css/pterodactyl.css')), 0, 12)) !!}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
        @show
    </head>
    <body class="hold-transition skin-blue ponk-admin">
        <div class="wrapper">
            <header class="main-header ponk-admin-header">
                <a href="{{ route('index') }}" class="ponk-admin-brand">
                    <span class="ponk-admin-brand__eyebrow">THE QUESTIONABLE PANEL</span>
                    <span class="ponk-admin-brand__title"><i class="fa fa-skull" aria-hidden="true"></i><strong>{{ config('app.name', 'Ponkodactyl') }}</strong></span>
                </a>
                <div class="ponk-admin-session">
                    <span class="ponk-admin-session__light"></span>
                    <span><small>CONTROL CHANNEL</small><strong>Admin session live</strong></span>
                </div>
                <div class="ponk-admin-header__actions">
                    <a href="{{ route('account') }}" class="ponk-admin-account">
                        <span class="ponk-admin-avatar" aria-hidden="true">{{ strtoupper(substr(Auth::user()->name_first, 0, 1) . substr(Auth::user()->name_last, 0, 1)) }}</span>
                        <span>{{ Auth::user()->name_first }} {{ Auth::user()->name_last }}</span>
                    </a>
                    <a href="{{ route('index') }}" class="ponk-admin-utility" title="Exit admin control" aria-label="Exit admin control"><i class="fa fa-server"></i><span>Client panel</span></a>
                    <a href="{{ route('auth.logout') }}" id="logoutButton" class="ponk-admin-utility" title="Logout" aria-label="Logout"><i class="fa fa-sign-out"></i><span>Logout</span></a>
                </div>
            </header>
            @php($currentRoute = Route::currentRouteName() ?? '')
            <nav class="ponk-admin-nav" aria-label="Administration">
                <div class="ponk-admin-nav__group" aria-label="Control">
                    <a href="{{ route('admin.index') }}" class="ponk-admin-nav__link {{ $currentRoute === 'admin.index' ? 'active' : '' }}" @if($currentRoute === 'admin.index') aria-current="page" @endif><i class="fa fa-home"></i><span>Overview</span></a>
                    <a href="{{ route('admin.settings') }}" class="ponk-admin-nav__link {{ starts_with($currentRoute, 'admin.settings') ? 'active' : '' }}" @if(starts_with($currentRoute, 'admin.settings')) aria-current="page" @endif><i class="fa fa-wrench"></i><span>Settings</span></a>
                    <a href="{{ route('admin.api.index') }}" class="ponk-admin-nav__link {{ starts_with($currentRoute, 'admin.api') ? 'active' : '' }}" @if(starts_with($currentRoute, 'admin.api')) aria-current="page" @endif><i class="fa fa-gamepad"></i><span>API</span></a>
                </div>
                <div class="ponk-admin-nav__group" aria-label="Infrastructure">
                    <a href="{{ route('admin.databases') }}" class="ponk-admin-nav__link {{ starts_with($currentRoute, 'admin.databases') ? 'active' : '' }}" @if(starts_with($currentRoute, 'admin.databases')) aria-current="page" @endif><i class="fa fa-database"></i><span>Databases</span></a>
                    <a href="{{ route('admin.locations') }}" class="ponk-admin-nav__link {{ starts_with($currentRoute, 'admin.locations') ? 'active' : '' }}" @if(starts_with($currentRoute, 'admin.locations')) aria-current="page" @endif><i class="fa fa-globe"></i><span>Locations</span></a>
                    <a href="{{ route('admin.nodes') }}" class="ponk-admin-nav__link {{ starts_with($currentRoute, 'admin.nodes') ? 'active' : '' }}" @if(starts_with($currentRoute, 'admin.nodes')) aria-current="page" @endif><i class="fa fa-sitemap"></i><span>Nodes</span></a>
                    <a href="{{ route('admin.servers') }}" class="ponk-admin-nav__link {{ starts_with($currentRoute, 'admin.servers') ? 'active' : '' }}" @if(starts_with($currentRoute, 'admin.servers')) aria-current="page" @endif><i class="fa fa-server"></i><span>Servers</span></a>
                    <a href="{{ route('admin.users') }}" class="ponk-admin-nav__link {{ starts_with($currentRoute, 'admin.users') ? 'active' : '' }}" @if(starts_with($currentRoute, 'admin.users')) aria-current="page" @endif><i class="fa fa-users"></i><span>Users</span></a>
                </div>
                <div class="ponk-admin-nav__group" aria-label="Game configuration">
                    <a href="{{ route('admin.mounts') }}" class="ponk-admin-nav__link {{ starts_with($currentRoute, 'admin.mounts') ? 'active' : '' }}" @if(starts_with($currentRoute, 'admin.mounts')) aria-current="page" @endif><i class="fa fa-magic"></i><span>Mounts</span></a>
                    <a href="{{ route('admin.nests') }}" class="ponk-admin-nav__link {{ starts_with($currentRoute, 'admin.nests') ? 'active' : '' }}" @if(starts_with($currentRoute, 'admin.nests')) aria-current="page" @endif><i class="fa fa-th-large"></i><span>Nests</span></a>
                </div>
            </nav>
            <div class="content-wrapper">
                <section class="content-header">
                    @yield('content-header')
                </section>
                <section class="content">
                    <div class="row">
                        <div class="col-xs-12">
                            @if (count($errors) > 0)
                                <div class="alert alert-danger">
                                    There was an error validating the data provided.<br><br>
                                    <ul>
                                        @foreach ($errors->all() as $error)
                                            <li>{{ $error }}</li>
                                        @endforeach
                                    </ul>
                                </div>
                            @endif
                            @foreach (Alert::getMessages() as $type => $messages)
                                @foreach ($messages as $message)
                                    <div class="alert alert-{{ $type }} alert-dismissable" role="alert">
                                        {{ $message }}
                                    </div>
                                @endforeach
                            @endforeach
                        </div>
                    </div>
                    @yield('content')
                </section>
            </div>
            <footer class="main-footer">
                <div class="pull-right small text-gray" style="margin-right:10px;margin-top:-7px;">
                    <strong><i class="fa fa-fw {{ $appIsGit ? 'fa-git-square' : 'fa-code-fork' }}"></i></strong> {{ $appVersion }}<br />
                    <strong><i class="fa fa-fw fa-clock-o"></i></strong> {{ round(microtime(true) - LARAVEL_START, 3) }}s
                </div>
                Copyright &copy; 2015 - {{ date('Y') }} <a href="https://ponkodactyl.local/">Ponkodactyl Software</a>.
            </footer>
        </div>
        @section('footer-scripts')
            <script src="/js/keyboard.polyfill.js" type="application/javascript"></script>
            <script>keyboardeventKeyPolyfill.polyfill();</script>

            {!! Theme::js('vendor/jquery/jquery.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/sweetalert/sweetalert.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap/bootstrap.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/slimscroll/jquery.slimscroll.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/adminlte/app.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/bootstrap-notify/bootstrap-notify.min.js?t={cache-version}') !!}
            {!! Theme::js('vendor/select2/select2.full.min.js?t={cache-version}') !!}
            {!! Theme::js('js/admin/functions.js?t={cache-version}') !!}
            <script src="/js/autocomplete.js" type="application/javascript"></script>

            @if(Auth::user()->root_admin)
                <script>
                    $('#logoutButton').on('click', function (event) {
                        event.preventDefault();

                        var that = this;
                        swal({
                            title: 'Do you want to log out?',
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d9534f',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Log out'
                        }, function () {
                             $.ajax({
                                type: 'POST',
                                url: '{{ route('auth.logout') }}',
                                data: {
                                    _token: '{{ csrf_token() }}'
                                },complete: function () {
                                    window.location.href = '{{route('auth.login')}}';
                                }
                        });
                    });
                });
                </script>
            @endif

            <script>
                $(function () {
                    $('[data-toggle="tooltip"]').tooltip();
                })
            </script>
        @show
    </body>
</html>
