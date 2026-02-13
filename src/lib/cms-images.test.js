import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getInfoSectionTextWithPictures } from './cms-images';

// Mock the global fetch
global.fetch = vi.fn();

describe('CMS Image Processing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock for getImageDataByPath
    // We need to mock the internal calls since we are testing getInfoSectionTextWithPictures
    // However, getInfoSectionTextWithPictures imports from itself usually, 
    // but here we might need to handle the network calls it makes.
  });

  it('should replace <img> tags with responsive <picture> markup', async () => {
    const mockHtml = '<p>Check this out: <img src="storage/uploads/test.jpg" alt="Test"></p>';
    
    // Mock the asset lookup
    fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ 
        _id: '123', 
        title: 'Test Image', 
        path: '/test.jpg', 
        width: 800, 
        height: 600 
      }))
    });

    // Mock the image source generation (4 calls: 2 sizes * 2 formats)
    // We'll mock the internal fetch calls made by getImageSource
    fetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('test-source-url')
    });

    const result = await getInfoSectionTextWithPictures(mockHtml);

    expect(result).toContain('<picture>');
    expect(result).toContain('<source srcset="test-source-url 400w, test-source-url 800w" type="image/webp"');
    expect(result).toContain('<source srcset="test-source-url 400w, test-source-url 800w" type="image/jpeg"');
    expect(result).toContain('src="https://cms.jaanituli.ee/storage/uploads/test.jpg"');
  });
});
