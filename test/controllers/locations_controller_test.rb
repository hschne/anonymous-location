# frozen_string_literal: true

require 'test_helper'

class LocationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @location = create(:location)
  end

  test 'should create location' do
    post locations_url,
         params: {
           location: {
             name: @location.name,
             expiry: @location.expiry,
             location: @location.location
           }
         }

    assert_redirected_to location_url(Location.last)
  end

  test 'should show location' do
    get location_url(@location)

    assert_response :success
  end
end
