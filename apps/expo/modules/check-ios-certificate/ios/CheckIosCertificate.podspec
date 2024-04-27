Pod::Spec.new do |s|
  s.name           = 'CheckIosCertificate'
  s.version        = '1.0.0'
  s.summary        = 'Check if iOS certificate is Development or Production.'
  s.description    = 'Check if iOS certificate is Development or Production.'
  s.author         = 'castdrian'
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = { :ios => '13.4', :tvos => '13.4' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
