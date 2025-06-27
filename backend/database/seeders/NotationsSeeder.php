<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class NotationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('notations')->insert([
            ['title' => 'Критично'],
            ['title' => 'Предупреждение'],
            ['title' => 'Информация'],
            ['title' => 'Важно'],
            ['title' => 'Второстепенно'],
        ]);
    }
}
