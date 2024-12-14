// app/api/submitForm/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.json(); // Parse incoming JSON data

    // Send the data to the Make.com webhook
    const response = await fetch('https://hook.eu2.make.com/khnaqvdff3tql4wdqmbgoiywm0q6j62v', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      return NextResponse.json({ message: 'Form submitted successfully!' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Something went wrong with Make.com webhook.' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
