# **Project Documentation: Map Drawing and Property Visualization App**

## **Overview**

This project is a web application that enables users to interact with a map interface by freehand drawing over specific regions. After drawing, the application communicates with a backend service to fetch properties within the drawn area and displays them on the map.

The core functionalities include:

- A fully functional map interface.
- Freehand drawing capability on the map.
- Backend integration to retrieve properties within the drawn area.
- Visualization of property locations on the map.

The demo can be found [here](https://ownkey-map.netlify.app/)

## **Features**

### 1. **Map User Interface**

- **Interactive Map**: Users can pan, zoom, and explore the map.
- **Drawing Tool**: Users can switch to a drawing mode where they can sketch an area of interest on the map.
- **Responsive Design**: The interface adapts to different screen sizes for seamless user experience across devices.

### 2. **Freehand Drawing Functionality**

- **Freehand Drawing**: Users can use a drawing tool to outline an area of interest on the map.
- **Clear Visual Feedback**: The drawn region is highlighted, providing clear feedback on the selected area.
- **Data Submission**: Upon completion of the drawing, the coordinates of the area are sent to a backend service.

### 3. **Property Visualization**

- **Backend Integration**: The app communicates with the backend API to retrieve properties within the drawn area.
- **Markers**: Properties returned from the backend are displayed as markers or pins on the map.
- **Dynamic Updates**: As new data is retrieved, the map updates dynamically to show the location of each property.

### 4. **Error Handling & Edge Cases**

- **Empty Responses**: The app gracefully handles scenarios where no properties are returned for the drawn area.
- **Error Handling**: Basic error handling is implemented to display user-friendly messages if issues arise (e.g., network errors or invalid drawings).

### 5. **Performance Optimization**

- **Efficient Rendering**: Optimizations ensure that even with a large number of properties, the map remains responsive.
- **Accessibility**: The app includes basic accessibility features, ensuring that it is usable for a wide range of users, including keyboard and screen reader support.

## **Requirements & Installation**

### **Prerequisites**

- Node.js and npm installed on your machine.
- A modern web browser for testing.

### **Installation Steps**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/GuyTito/ownkey-frontend-test.git
   ```
2. **Install dependencies**:

   Navigate into the project directory and run:

   ```bash
   npm i
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   This will launch the app at `http://localhost:5173/`

## Design Decisions

- **Map Library Choice**:

  I chose Google Maps JavaScript API together with its React library `@vis.gl/react-google-maps` for its simplicity and flexibility in rendering maps and adding drawing layers.

### **Backend Service Integration & API keys**

- The application relies on TomTom Search API service to fetch property data. Create an account to get an API key. Ensure that the backend API is running and accessible.
- Get your Google Map API Key from the Google Cloud Console.
- The API key can be configured in the .env file in the project root.

  ```env
  VITE_GOOGLE_MAP_API_KEY=your-google-map-api-key
  VITE_TOMTOM_API_KEY=your-tomtom-api-key
  ```

## Challenges Encountered

- **Drawing Precision:**

  Ensuring the freehand drawing tool was intuitive while maintaining accuracy in capturing the drawn area presented some challenges, which were addressed by managing how many times mouse move event handler was called.
