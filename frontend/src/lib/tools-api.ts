/**
 * Tools Management API Functions
 */

import type { Tool } from '@/types/wordpress';

const API_BASE = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8888/bimverdi/wordpress/index.php?rest_route=';

export interface ToolFormData {
  title: string;
  content?: string;
  acf?: {
    tool_name?: string;
    tool_logo?: any;
    tool_description?: string;
    tool_category?: string;
    tool_vendor?: string;
    tool_website?: string;
    tool_price_range?: string;
    tool_platforms?: string[];
    tool_features?: string;
  };
}

/**
 * Get tools for user's member
 */
export async function getMyTools(userId: number): Promise<Tool[]> {
  try {
    const url = `${API_BASE}/bimverdi/v1/tools/my-tools&user_id=${userId}`;
    console.log('🌐 Fetching tools from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Failed to fetch tools:', errorText);
      throw new Error('Failed to fetch tools');
    }

    const data = await response.json();
    console.log('📦 Response data:', data);
    return data.tools || [];
  } catch (error) {
    console.error('❌ Error fetching tools:', error);
    return [];
  }
}

/**
 * Create new tool
 */
export async function createTool(userId: number, toolData: ToolFormData): Promise<number | null> {
  try {
    const response = await fetch(
      `${API_BASE}/bimverdi/v1/tools`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          ...toolData,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create tool');
    }

    const data = await response.json();
    return data.tool_id;
  } catch (error) {
    console.error('Error creating tool:', error);
    throw error;
  }
}

/**
 * Update existing tool
 */
export async function updateTool(userId: number, toolId: number, toolData: Partial<ToolFormData>): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_BASE}/bimverdi/v1/tools/${toolId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          ...toolData,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update tool');
    }

    return true;
  } catch (error) {
    console.error('Error updating tool:', error);
    throw error;
  }
}

/**
 * Delete tool
 */
export async function deleteTool(userId: number, toolId: number): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_BASE}/bimverdi/v1/tools/${toolId}&user_id=${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete tool');
    }

    return true;
  } catch (error) {
    console.error('Error deleting tool:', error);
    throw error;
  }
}
