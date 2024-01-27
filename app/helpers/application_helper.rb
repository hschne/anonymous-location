# frozen_string_literal: true

module ApplicationHelper
  def link_classes
    'underline font-medium hover:no-underline active:text-gray-500'
  end

  def flash_classes(flash_type)
    case flash_type
    when :notice
      'bg-blue-100 border-blue-400 text-blue-700'
    when :success
      'bg-green-100 border-green-400 text-green-700'
    when :warning
      'bg-yellow-100 border-yellow-400 text-yellow-700'
    when :alert
      'bg-red-100 border-red-400 text-red-700'
    else
      'bg-gray-100 border-gray-400 text-gray-700'
    end
  end
end
