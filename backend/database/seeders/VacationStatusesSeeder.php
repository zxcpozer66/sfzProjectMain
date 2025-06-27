<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class VacationStatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('vacation_statuses')->insert([
            ['title' => 'Ожидает одобрения'],
            ['title' => 'Одобрен'],
            ['title' => 'Отклонён'],
        ]);
    }
}
