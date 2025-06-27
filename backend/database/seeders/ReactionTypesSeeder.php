<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ReactionTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('reactions_type')->insert([
            ['title' => 'Срочно'],
            ['title' => 'В течение дня'],
            ['title' => 'В течение часа'],
            ['title' => 'Сегодня'],
        ]);
    }
}
