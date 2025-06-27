<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notation;

class NotationController extends Controller
{
    public function index()
    {
        $notation = Notation::all();
        return response()->json($notation);
    }
}
