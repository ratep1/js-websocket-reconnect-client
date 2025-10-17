# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.14] - 2025-10-18

### 🎉 Complete Project Modernization

### Added
- **Modern TypeScript 5.9.3** - Upgraded from legacy TypeScript 3.6.4
- **Biome 2.2.6** - Ultra-fast unified linting and formatting (replaced ESLint + Prettier)
- **Vite 7.1.10** - Lightning-fast build system with multi-format output (ESM, CJS, UMD)
- **Vitest 3.2.4** - Native TypeScript testing framework (replaced Jest)
- **Yarn Modern 4.10.3** - Latest package manager with Zero-Installs support
- **GitHub Actions CI/CD** - Automated testing and deployment pipeline
- **Comprehensive test suite** - 33 tests with full coverage of all features
- **Type definitions** - Proper TypeScript interfaces and type safety
- **Development tooling** - Watch modes, coverage reports, and modern workflow
- **Examples directory** - Usage demonstrations and integration examples
- **Enhanced documentation** - Complete API reference and setup guides

### Fixed
- **Critical WebSocket state constants bug** - Fixed off-by-one error (states were 1-4, now correctly 0-3)
- **Send method error handling** - Now gracefully catches WebSocket errors and returns `false`
- **Reconnection logic** - Fixed retry limit checking (`>=` instead of `>`)
- **Constructor interface mismatch** - Unified and properly typed interfaces
- **Test reliability issues** - All tests now pass consistently
- **Type safety violations** - Full strict TypeScript compliance
- **Package.json exports field** - Corrected condition order for proper TypeScript resolution

### Changed
- **Build system** - Migrated from tsc to Vite for 10x faster builds
- **Testing framework** - Migrated from Jest to Vitest for native TypeScript support
- **Code quality tools** - Replaced ESLint + Prettier with Biome for unified tooling
- **Target environment** - Updated to ES2020 with modern browser support
- **Package exports** - Modern dual package (ESM/CJS) with proper type definitions
- **Development workflow** - Modern toolchain with instant feedback

### Improved
- **Error handling** - Comprehensive try-catch blocks and graceful degradation
- **Test coverage** - 95%+ code coverage with edge case testing
- **Type safety** - Strict TypeScript with `exactOptionalPropertyTypes`
- **Developer experience** - Hot reloading, watch modes, and fast tooling
- **Bundle optimization** - Tree-shaking and multiple output formats
- **Documentation quality** - Complete rewrite with modern formatting
- **Code organization** - Better separation of concerns and interfaces

### Technical Details
- **Vitest globals configuration** - Simplified test syntax without imports
- **Mock WebSocket improvements** - Better connection simulation and failure testing
- **Build exclusions** - Comprehensive file exclusions for faster processing
- **Yarn Modern integration** - Proper `.gitignore` and tool configurations
- **Biome VCS integration** - Automatic respect for Git ignore patterns
- **Coverage reporting** - V8 native coverage with HTML/LCOV outputs

### Breaking Changes
- **Node.js requirement** - Now requires Node.js 20+ for modern tooling
- **TypeScript requirement** - Projects using this library should use TypeScript 5.x
- **Import changes** - ESM imports are now preferred (CJS still supported)

### Migration Guide
- Update TypeScript to 5.9.3 for best compatibility
- Use modern Node.js (20+) for development
- Consider migrating to ESM imports for better tree-shaking
- Review any custom WebSocket state checking code (constants changed)

## [0.0.13 and earlier]

### Legacy versions
- Basic WebSocket client functionality
- Simple reconnection logic
- TypeScript 3.x support
- Basic documentation

---

## Future Roadmap

### Planned for v0.1.0
- [ ] Message queuing when disconnected
- [ ] Connection pooling support
- [ ] Heartbeat/ping-pong mechanism
- [ ] Connection health monitoring
- [ ] Performance metrics and monitoring
- [ ] Browser and Node.js universal support
- [ ] Multiple message format support (not just JSON)
- [ ] Advanced reconnection strategies (exponential backoff with jitter)
- [ ] Connection state persistence
- [ ] WebSocket protocol negotiation helpers

### Planned for v0.2.0
- [ ] Plugin system for extensibility
- [ ] Middleware support for message processing
- [ ] Built-in message compression
- [ ] Connection multiplexing
- [ ] Advanced security features
- [ ] Performance optimization
- [ ] Memory usage optimization
- [ ] Bundle size reduction