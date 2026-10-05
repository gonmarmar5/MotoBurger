# Moto Burger

> A modern, responsive restaurant website for a burger joint.

## Features
- 🍔 **Hero Section**: Engaging introduction with a call to action.
- 🍽️ **Menu**: Detailed menu with categories (burgers, sides, drinks) and pricing.
- 📱 **Responsive Design**: Built with Tailwind CSS for seamless viewing on desktop, tablet, and mobile.
- 🎨 **Modern UI**: High-quality imagery, smooth transitions, and a professional aesthetic.

## Live Demo

![Moto Burger Live Demo](demo.png)

[View Live Demo](https://github.com/gonmarmar5/MotoBurger)

## Getting Started

To run this project locally, you can use `http-server`.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd MotoBurger
    ```

### Usage

Start the development server with the following command:

```bash
npx -y http-server . -p 3000 --cors -o
```

This will:
- Serve the files in the current directory (`.`).
- Open the application in your default browser (`-o`).
- Enable Cross-Origin Resource Sharing (`--cors`).
- Run on port `3000` (`-p 3000`).

## Project Structure

```
moto-burger/
├── index.html          # Main application entry point
├── css/
│   └── style.css       # Custom styles
├── assets/
│   ├── images/         # All images used in the project
│   └── data.json       # Menu data
└── js/
    └── script.js       # Main JavaScript logic
```

## Development

### Updating the Menu

To update the menu items, edit the `assets/data.json` file. The structure is as follows:

```json
{
  "categories": [
    {
      "name": "BURGERS",
      "items": [
        {
          "image": "assets/images/1.png",
          "name": "HAMBURGER",
          "description": "Classic hamburger with fresh ingredients",
          "price": "20,000"
        },
        // ... more burgers
      ]
    },
    // ... other categories
  ]
}
```

### Adding New Images

1.  Place your image in the `assets/images/` directory.
2.  Update the `"image":` field in `assets/data.json` with the new path.
3.  Ensure the image aspect ratio is consistent (3:2 is recommended) for a uniform look.

## Technologies Used
- **HTML5**: Structure
- **CSS3**: Styling
- **JavaScript**: Dynamic content loading
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library
- **Google Fonts**: Typography (Inter & Roboto Condensed)

## License

ISC