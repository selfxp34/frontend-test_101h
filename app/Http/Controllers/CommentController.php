<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    public function index()
    {
      $comments = Comment::all()->toArray();
    $comments = array_map(
        function ($item) {
            return [
                'id' => $item['id'],
                'author' => $item['name'], // Изменили 'name' на 'author'
                'content' => $item['text'], // Изменили 'text' на 'content'
                'date' => $item['date'],
            ];
        },
        $comments);
    return array_reverse($comments);
    }

    public function store(Request $request)
{
    $request->validate([
        'name' => 'required',
        'text' => 'required',
        'date' => 'required',
    ]);

    $comment = new Comment([
        'name' => $request->input('name'),
        'text' => $request->input('text'),
        'date' => $request->input('date'),
    ]);
    $comment->save();

    return response()->json([
        'id' => $comment->id,
        'author' => $comment->name, // Изменили 'name' на 'author'
        'content' => $comment->text, // Изменили 'text' на 'content'
        'date' => $comment->date
    ]);
}

    public function show($id)
    {
        $product = Comment::find($id);
        return response()->json($product);
    }

    public function update($id, Request $request)
    {
        $product = Comment::find($id);
        $product->update($request->all());

        return response()->json('Product updated!');
    }

    public function destroy($id)
    {
        $product = Comment::find($id);
        $product->delete();

        return response()->json('Product deleted!');
    }
    
}