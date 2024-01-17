# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_01_17_105656) do
  create_table "clients", force: :cascade do |t|
    t.string "uuid", null: false
    t.string "name", null: false
    t.string "color", null: false
    t.string "coordinates", null: false
    t.integer "location_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["location_id"], name: "index_clients_on_location_id"
  end

  create_table "dice_words", force: :cascade do |t|
    t.string "words"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "locations", force: :cascade do |t|
    t.string "key", null: false
    t.string "name", null: false
    t.integer "expiry", null: false
    t.datetime "expires_at", null: false
    t.string "location", null: false
    t.integer "client_count", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_locations_on_key", unique: true
  end

  add_foreign_key "clients", "locations"
end
