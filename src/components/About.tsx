import React from 'react';

export function About() {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-primary mb-6">About Tana's Tastings</h1>
      
      <div className="prose prose-lg">
        <p className="mb-6">
          Welcome to Tana's Tastings, a culinary journey born from love and necessity. When my husband was diagnosed with diabetes, 
          our world of food and cooking had to transform. But we were determined not to let this diagnosis diminish our joy of eating 
          delicious, satisfying meals.
        </p>

        <p className="mb-6">
          Like many facing diabetes, we initially struggled with the dietary restrictions and the constant worry about blood sugar levels. 
          The challenge wasn't just about cutting carbs – it was about finding ways to create meals that could satisfy those inevitable 
          cravings for comfort food while keeping blood sugar in check.
        </p>

        <p className="mb-6">
          Through countless hours of experimentation in the kitchen, we discovered that with the right ingredients and techniques, 
          we could create low-carb versions of our favorite dishes that were just as delicious as their traditional counterparts. 
          What started as a necessity became a passion for creating diabetes-friendly recipes that don't compromise on taste.
        </p>

        <p className="mb-6">
          Every recipe you'll find here has been tested and enjoyed in our own kitchen. We carefully calculate the nutritional 
          information and net carbs to help you make informed decisions about your meals. Our goal is to show that managing 
          diabetes doesn't mean giving up the pleasures of good food – it's about discovering new ways to enjoy it.
        </p>

        <p>
          We hope these recipes bring the same joy to your kitchen as they have to ours. Here's to healthy, delicious eating!
        </p>
      </div>
    </div>
  );
}