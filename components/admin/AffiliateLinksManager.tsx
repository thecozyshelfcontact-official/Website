'use client'

import { useState } from 'react'
import { Plus, Trash2, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AffiliateLinksManager({
                                                  productId,
                                                  initialLinks,
                                              }: {
    productId: string
    initialLinks: any[]
}) {
    const [links, setLinks] = useState(initialLinks || [])
    const [loading, setLoading] = useState(false)

    const addLink = async () => {
        setLoading(true)

        try {
            const res = await fetch('/api/admin/affiliate-links', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    product_id: productId,
                    label: 'Buy on Amazon',
                    url: '',
                    network: 'Amazon',
                    commission_rate: 0,
                    is_primary: links.length === 0,
                }),
            })

            const data = await res.json()

            setLinks([...links, data])

            toast.success('Affiliate link added ✨')
        } catch {
            toast.error('Failed to add link')
        }

        setLoading(false)
    }

    const updateLink = async (
        id: string,
        field: string,
        value: any
    ) => {
        const updated = links.map((link: any) => {
            if (link.id === id) {
                return {
                    ...link,
                    [field]: value,
                }
            }

            if (field === 'is_primary' && value === true) {
                return {
                    ...link,
                    is_primary: false,
                }
            }

            return link
        })

        setLinks(updated)

        const current = updated.find((l: any) => l.id === id)

        await fetch(`/api/admin/affiliate-links/${id}`, {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify(current),
        })
    }

    const deleteLink = async (id: string) => {
        if (!confirm('Delete affiliate link?')) return

        await fetch(`/api/admin/affiliate-links/${id}`, {
            method: 'DELETE',
        })

        setLinks(
            links.filter((l: any) => l.id !== id)
        )

        toast.success('Affiliate link deleted')
    }

    return (
        <div className="bg-cream rounded-3xl border border-cozy-200 p-6 shadow-cozy space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-serif text-xl font-bold text-cozy-900">
                        Affiliate Links
                    </h2>

                    <p className="text-sm text-cozy-500 mt-1">
                        Manage product purchase links
                    </p>
                </div>

                <button
                    onClick={addLink}
                    disabled={loading}
                    className="btn-primary text-sm py-2.5"
                >
                    <Plus size={15} />
                    Add Link
                </button>
            </div>

            {links.length === 0 && (
                <div className="text-center py-10 border border-dashed border-cozy-200 rounded-2xl">
                    <p className="text-cozy-400">
                        No affiliate links added yet
                    </p>
                </div>
            )}

            <div className="space-y-4">
                {links.map((link: any) => (
                    <div
                        key={link.id}
                        className="border border-cozy-100 rounded-2xl p-5 bg-cream space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <label className="text-xs uppercase tracking-wide text-cozy-500">
                                    Button Label
                                </label>

                                <input
                                    type="text"
                                    value={link.label}
                                    onChange={(e) =>
                                        updateLink(
                                            link.id,
                                            'label',
                                            e.target.value
                                        )
                                    }
                                    className="input-cozy mt-1"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wide text-cozy-500">
                                    Network
                                </label>

                                <input
                                    type="text"
                                    value={link.network || ''}
                                    onChange={(e) =>
                                        updateLink(
                                            link.id,
                                            'network',
                                            e.target.value
                                        )
                                    }
                                    className="input-cozy mt-1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-wide text-cozy-500">
                                Affiliate URL
                            </label>

                            <input
                                type="text"
                                value={link.url}
                                onChange={(e) =>
                                    updateLink(
                                        link.id,
                                        'url',
                                        e.target.value
                                    )
                                }
                                className="input-cozy mt-1"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <label className="text-xs uppercase tracking-wide text-cozy-500">
                                    Commission Rate (%)
                                </label>

                                <input
                                    type="number"
                                    value={link.commission_rate || 0}
                                    onChange={(e) =>
                                        updateLink(
                                            link.id,
                                            'commission_rate',
                                            Number(e.target.value)
                                        )
                                    }
                                    className="input-cozy mt-1"
                                />
                            </div>

                            <div className="flex items-center gap-6 pt-6">

                                <label className="flex items-center gap-2 text-sm text-cozy-700">
                                    <input
                                        type="checkbox"
                                        checked={link.is_primary}
                                        onChange={(e) =>
                                            updateLink(
                                                link.id,
                                                'is_primary',
                                                e.target.checked
                                            )
                                        }
                                    />

                                    Primary
                                </label>

                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">

                            <a
                                href={link.url}
                                target="_blank"
                                className="flex items-center gap-2 text-sm text-sage-700 hover:text-bark hover:underline"
                            >
                                <ExternalLink size={14} />
                                Open Link
                            </a>

                            <button
                                onClick={() => deleteLink(link.id)}
                                className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm"
                            >
                                <Trash2 size={14} />
                                Delete
                            </button>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
