import app
with app.app.app_context():
    prods = app.Product.query.all()
    for p in prods:
        cat = app.Category.query.get(p.category_id)
        sub = app.SubCategory.query.get(p.subcategory_id) if p.subcategory_id else None
        print(f'{p.id}: {p.name} (cat={cat.name if cat else "?"}, sub={sub.name if sub else "None"})')
