class CreateLocations < ActiveRecord::Migration[7.1]
  def change
    create_table :locations do |t|
      t.string :key, null: false
      t.string :name, null: false
      t.integer :expiry, null: false
      t.datetime :expires_at, null: false
      t.string :location, null: false
      t.integer :client_count, null: false, default: 0

      t.timestamps
    end
    add_index :locations, :key, unique: true
  end
end
