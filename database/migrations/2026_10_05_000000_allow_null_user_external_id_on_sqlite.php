<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class () extends Migration {
    public function up(): void
    {
        if (DB::connection()->getDriverName() !== 'sqlite' || !Schema::hasColumn('users', 'external_id')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            $table->string('external_id')->nullable()->change();
        });
    }

    public function down(): void
    {
    }
};
