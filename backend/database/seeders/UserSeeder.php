<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            [
                'username' => 'administrator',
                'name' => 'admin',
                'surname' => 'admin',
                'patronymic' => 'admin',
                'role_id' => 1,
                'department_id' => 1
            ]
        ]);
    }
}
