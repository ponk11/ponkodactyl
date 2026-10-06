<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MigrateSettingsTableToNewFormat extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            Schema::drop('settings');
            Schema::create('settings', function (Blueprint $table) {
                $table->increments('id');
                $table->string('key')->unique();
                $table->text('value');
            });

            return;
        }

        DB::table('settings')->truncate();
        Schema::table('settings', function (Blueprint $table) {
            $table->increments('id')->first();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            Schema::drop('settings');
            Schema::create('settings', function (Blueprint $table) {
                $table->string('key')->unique();
                $table->text('value');
            });

            return;
        }

        Schema::table('settings', function (Blueprint $table) {
            $table->dropColumn('id');
        });
    }
}
