import React, { useState } from 'react';

interface WishlistItemProps {
  item: {
    id: string;
    name: string;
    description?: string;
    url?: string;
    price?: number;
    priority: number;
  };
  onDelete: (id: string) => void;
}

export default function WishlistItem({ item, onDelete }: WishlistItemProps) {
  const [isPurchased, setIsPurchased] = useState(false);

  const handlePurchase = async () => {
    try {
      const response = await fetch(`/api/wishlists/items/${item.id}/purchase`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setIsPurchased(true);
      }
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  return (
    <div className={`p-4 border rounded-lg ${isPurchased ? 'bg-gray-100' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          {item.description && (
            <p className="text-gray-600 mt-1">{item.description}</p>
          )}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-christmas-red hover:underline mt-1 block"
            >
              View Item
            </a>
          )}
          {item.price && (
            <p className="text-gray-700 mt-1">
              Price: ${item.price.toFixed(2)}
            </p>
          )}
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-christmas-green text-white">
              Priority: {item.priority}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {!isPurchased && (
            <button
              onClick={handlePurchase}
              className="px-3 py-1 bg-christmas-green text-white rounded hover:bg-opacity-90"
            >
              Mark Purchased
            </button>
          )}
          <button
            onClick={() => onDelete(item.id)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
