<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            VacationStatusesSeeder::class,
            RolesSeeder::class,
            ReactionTypesSeeder::class,
            NotationsSeeder::class,
            DepartmentsSeeder::class,
            UserSeeder::class
        ]);
    }
}
