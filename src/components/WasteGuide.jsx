import React from 'react'
import { Apple, Package, Recycle, Check, Trash2 } from 'lucide-react'

export default function WasteGuide() {
  const wasteCategories = [
    {
      title: 'Wet Waste',
      colorClass: 'bg-lightGreen border-moss/40',
      badgeClass: 'bg-forest text-white',
      iconBg: 'bg-forest text-white',
      binColor: 'text-forest',
      icon: Apple,
      binType: 'Green Bin',
      description: 'Organic and biodegradable waste that can be composted into nutrient-rich soil.',
      items: [
        'Food scraps',
        'Fruit and vegetable peels',
        'Tea leaves',
        'Garden waste',
      ],
    },
    {
      title: 'Dry Waste',
      colorClass: 'bg-white border-moss/30',
      badgeClass: 'bg-moss text-white',
      iconBg: 'bg-moss text-white',
      binColor: 'text-moss-dark',
      icon: Package,
      binType: 'Blue Bin',
      description: 'Non-biodegradable items that should be kept dry and clean to prevent contamination.',
      items: [
        'Paper',
        'Cardboard',
        'Plastic wrappers',
        'Cloth',
      ],
    },
    {
      title: 'Recyclable Waste',
      colorClass: 'bg-lightGreen/50 border-forest/30',
      badgeClass: 'bg-forest-light text-white',
      iconBg: 'bg-forest text-white',
      binColor: 'text-forest',
      icon: Recycle,
      binType: 'Yellow / Red Bin',
      description: 'Processed materials that can be remanufactured into new usable products.',
      items: [
        'Plastic bottles',
        'Glass bottles',
        'Metal cans',
        'Clean paper and cardboard',
      ],
    },
  ]

  return (
    <section id="waste-guide" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-moss tracking-widest uppercase">Education & Habits</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest mt-1 tracking-tight">
            Waste Segregation Guide
          </h2>
          <p className="mt-3 text-darkText/70 text-base">
            Proper segregation at the source makes society recycling and composting effortless. Learn what goes where!
          </p>
        </div>

        {/* 3 Waste Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {wasteCategories.map((cat, idx) => {
            const Icon = cat.icon
            return (
              <div
                key={idx}
                className={`rounded-3xl p-8 border shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between ${cat.colorClass}`}
              >
                <div>
                  {/* Top Bar with Icon and Bin Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xs ${cat.iconBg}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${cat.badgeClass}`}>
                      {cat.binType}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-extrabold text-forest mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-darkText/70 text-sm mb-6 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Items List */}
                  <div className="border-t border-moss/20 pt-5">
                    <p className="text-xs font-bold text-moss uppercase tracking-wider mb-3">
                      Accepted Items:
                    </p>
                    <ul className="space-y-2.5">
                      {cat.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-center gap-2.5 text-sm font-medium text-darkText">
                          <span className="w-5 h-5 rounded-full bg-forest/10 text-forest flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom reminder tip */}
                <div className="mt-8 pt-4 border-t border-moss/10 flex items-center gap-2 text-xs text-darkText/60">
                  <Trash2 className="w-4 h-4 text-moss" />
                  <span>Always ensure bins are closed after disposal.</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
