import { Component } from 'react'

export default class CanvasErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(err) {
    console.warn('3D canvas failed to load:', err.message)
  }

  render() {
    if (this.state.hasError) {
      // Render nothing — the section still looks fine without the canvas
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}
