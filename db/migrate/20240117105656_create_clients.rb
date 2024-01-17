class CreateClients < ActiveRecord::Migration[7.1]
  def change
    create_table :clients do |t|
      t.string :uuid, null: false
      t.string :name, null: false
      t.string :color, null: false
      t.string :coordinates, null: false
      t.references :location, null: false, foreign_key: true

      t.timestamps
    end
  end
end
