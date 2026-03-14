# Database Design

---

# Database Overview

The application uses MongoDB as its primary database because it provides a flexible document-based structure that is suitable for storing tourism information, user preferences, AI-generated recommendations, and travel-related data.

Unlike traditional relational databases, MongoDB allows different tourist places to store different types of information while maintaining a scalable architecture.

The database is designed to support India's tourism ecosystem by organizing information state-wise and district-wise.

---

# Database Hierarchy

India

↓

State

↓

District

↓

Tourist Places

↓

Nearby Services

↓

Hotels

↓

Restaurants

↓

User Trips

↓

Feedback

↓

AI Recommendations

---

# Main Collections

The database consists of the following collections:

1. States
2. Districts
3. Tourist Places
4. Hotels
5. Restaurants
6. Users
7. Trips
8. User Preferences
9. Feedback
10. AI Recommendations

---

# Collection Relationships

States

↓

Districts

↓

Tourist Places

↓

Hotels

Restaurants

Nearby Services

↓

Trips

↓

Feedback

↓

AI Recommendations

---

# Purpose of Each Collection

## States

Stores information about all Indian states and Union Territories.

Example Information:

- State Name
- Capital
- Language
- Description
- Best Season
- Tourism Type

---

## Districts

Stores districts belonging to each state.

Example Information:

- District Name
- State
- Description
- Famous For
- Latitude
- Longitude

---

## Tourist Places

Stores detailed information about every tourist place.

Example Information:

- Place Name
- Category
- History
- Description
- Best Time to Visit
- Entry Fee
- Opening Time
- Closing Time
- Best Season
- Coordinates
- AI Tags
- Nearby Attractions
- Local Foods
- Hidden Gems

---

## Hotels

Stores hotel information.

Example Information:

- Hotel Name
- Address
- Contact
- Rating
- Price Range
- Nearby Tourist Places

---

## Restaurants

Stores restaurant information.

Example Information:

- Restaurant Name
- Cuisine
- Address
- Contact
- Rating
- Price Range

---

## Users

Stores user account information.

Example Information:

- Name
- Email
- Password
- Travel Preferences
- Favourite Places
- Previous Trips

---

## Trips

Stores every trip planned by the user.

Example Information:

- Destination
- Budget
- Travel Dates
- Itinerary
- Expenses
- Travel Notebook

---

## User Preferences

Stores user interests collected through profile setup or Google Form dataset.

Example Information:

- Nature
- Adventure
- Beaches
- Mountains
- Wildlife
- Temples
- Shopping
- Photography
- Food
- Budget Preference

---

## Feedback

Stores user ratings and reviews.

Example Information:

- Ratings
- Reviews
- Visited Places
- Suggestions

---

## AI Recommendations

Stores AI-generated recommendations for future analysis.

Example Information:

- Recommended Places
- Budget Split
- AI Travel Plan
- Crowd Suggestion
- Weather Suggestion

---

# Database Advantages

• Easy to scale

• Flexible document structure

• Faster retrieval of tourism information

• Easy integration with AI

• Supports future expansion

• Suitable for large tourism datasets

---

# Database Collections

The database is divided into multiple collections based on the functionality of the system.

The following collections will be created:

---

## 1. States

Purpose:

Stores information about every Indian state and Union Territory.

Fields:

- State ID
- State Name
- Capital
- Languages
- Tourism Categories
- Description
- Best Season

---

## 2. Districts

Purpose:

Stores all districts belonging to a particular state.

Fields:

- District ID
- State ID
- District Name
- Headquarters
- Description
- Famous For
- Latitude
- Longitude

---

## 3. Tourist Places

Purpose:

Stores detailed tourism information for every tourist place.

Fields:

- Place ID
- State ID
- District ID
- Place Name
- Category
- Description
- History
- Entry Fee
- Opening Time
- Closing Time
- Best Season
- Visit Duration
- Latitude
- Longitude
- AI Tags
- Nearby Attractions
- Hidden Gems
- Local Foods

---

## 4. Users

Purpose:

Stores registered user information.

---

## 5. Trips

Purpose:

Stores user trip details.

---

## 6. Hotels

Purpose:

Stores hotel information.

---

## 7. Restaurants

Purpose:

Stores restaurant information.

---

## 8. Feedback

Purpose:

Stores user ratings and reviews.

---

## 9. User Preferences

Purpose:

Stores user interests and travel preferences.

---

## 10. AI Recommendations

Purpose:

Stores AI-generated travel recommendations.

---