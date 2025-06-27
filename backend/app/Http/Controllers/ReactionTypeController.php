<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ReactionType;

class ReactionTypeController extends Controller
{
    public function index()
    {
        $reaction = ReactionType::all();
        return response()->json($reaction);
    }
}
