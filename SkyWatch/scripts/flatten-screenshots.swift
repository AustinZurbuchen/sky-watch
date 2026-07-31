#!/usr/bin/env swift

// Flattens the alpha channel out of App Store screenshots.
//
// App Store Connect rejects PNGs that carry an alpha channel, and every
// screenshot `xcrun simctl io … screenshot` produces has one. This composites
// each image onto the app's background colour and writes it back out as opaque
// RGB, leaving the source untouched.
//
// Written in Swift against CoreGraphics on purpose: it needs no toolchain the
// machine doesn't already have. ImageMagick and Pillow are not installed here,
// and `sips` cannot drop an alpha channel (`--padToHeightWidth` re-encodes but
// keeps it).
//
//   ./scripts/flatten-screenshots.swift <input-dir> <output-dir>
//
// See agents/deployment-agent.md for where this sits in the release flow.

import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

// Colors.dark.background — keep in sync with src/constants/theme.ts. Only shows
// through where a pixel is actually translucent, which for a screenshot is
// nowhere; it exists so a partly transparent pixel never composites onto black.
let background = CGColor(red: 10 / 255, green: 13 / 255, blue: 26 / 255, alpha: 1)

func fail(_ message: String) -> Never {
    FileHandle.standardError.write("error: \(message)\n".data(using: .utf8)!)
    exit(1)
}

func flatten(_ input: URL, to output: URL) throws {
    guard let source = CGImageSourceCreateWithURL(input as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        fail("could not read \(input.lastPathComponent)")
    }

    let width = image.width, height = image.height
    guard let context = CGContext(data: nil,
                                  width: width,
                                  height: height,
                                  bitsPerComponent: 8,
                                  bytesPerRow: 0,
                                  space: CGColorSpaceCreateDeviceRGB(),
                                  bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue) else {
        fail("could not create a context for \(input.lastPathComponent)")
    }

    context.setFillColor(background)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))
    context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))

    guard let flattened = context.makeImage(),
          let destination = CGImageDestinationCreateWithURL(output as CFURL,
                                                           UTType.png.identifier as CFString,
                                                           1,
                                                           nil) else {
        fail("could not write \(output.lastPathComponent)")
    }

    CGImageDestinationAddImage(destination, flattened, nil)
    guard CGImageDestinationFinalize(destination) else {
        fail("could not finalise \(output.lastPathComponent)")
    }

    print("  \(input.lastPathComponent)  \(width)x\(height)")
}

let arguments = CommandLine.arguments
guard arguments.count == 3 else {
    fail("usage: flatten-screenshots.swift <input-dir> <output-dir>")
}

let inputDir = URL(fileURLWithPath: arguments[1], isDirectory: true)
let outputDir = URL(fileURLWithPath: arguments[2], isDirectory: true)

guard let entries = try? FileManager.default.contentsOfDirectory(at: inputDir,
                                                                 includingPropertiesForKeys: nil) else {
    fail("could not list \(inputDir.path)")
}

let pngs = entries.filter { $0.pathExtension.lowercased() == "png" }.sorted { $0.path < $1.path }
guard !pngs.isEmpty else { fail("no .png files in \(inputDir.path)") }

try? FileManager.default.createDirectory(at: outputDir, withIntermediateDirectories: true)

print("flattening \(pngs.count) screenshot(s) → \(outputDir.path)")
for png in pngs {
    try flatten(png, to: outputDir.appendingPathComponent(png.lastPathComponent))
}
print("done — verify with: sips -g hasAlpha <file>")
